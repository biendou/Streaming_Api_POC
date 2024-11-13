// Index.js (or your component file name)

import { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Pressable } from "react-native";

// Mock API response function
export async function mockApiResponse() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      //convert this array in a array of words
      const messages =['This', 'is', 'a', 'mock', 'API', 'response', 'for', 'demo.', 'It', 'is', 'streamed', 'to', 'the', 'client', 'to', 'demonstrate', '[benefit', 'of', 'streaming,', 'e.g.,', 'reduced', 'latency,', 'handling', 'large', 'data].', 'You', 'can', 'add', 'more', 'messages', 'here', 'to', 'simulate', 'different', 'data', 'points', 'or', 'events.', 'This', 'is', 'the', 'end', 'of', 'the', 'response,', 'indicating', 'a', 'successful', 'completion.'].map((word) => word + ' ');
      // const messages = [
      //   "This"," is"," a"," mock"," API"," response. ",
      //   "It"," is"," streamed to the client. ",
      //   "You can add more messages here. ",
      //   "This is the end of the response."
      // ];

      for (const message of messages) {
        controller.enqueue(encoder.encode(message));
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
      }
      controller.close();
    },
  });

  return new Response(stream);
}

export default function Index() {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  const handlePress = useCallback(async () => {
    setResponse("");
    setIsStreaming(true);

    // Use the mock API response in development or testing
    const response = process.env.NODE_ENV === 'development' 
      ? await mockApiResponse() 
      : await fetch("http://localhost:8081/ai"); 

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      try {
       const { value, done } = await reader!.read();
        if (done) break;
        setResponse((prev) => prev + value);
      } catch (e) {
        console.error(`Error reading response: ${e}`);
        setIsStreaming(false);
        break;
      } finally {
        setIsStreaming(false);
      }
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white", 
      }}
    >

     <Pressable onPress={handlePress} disabled={isStreaming}>
       <Text>Press me to stream!{"\n"}</Text>
     </Pressable>
     <Text>Streamed response:{"\n"}</Text>
     <Text>{response}</Text>
   </View>
  );
}