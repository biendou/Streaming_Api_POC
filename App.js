// Index.js (or your component file name)

import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";

// Mock API response function
// export async function mockApiResponse() {
//   const encoder = new TextEncoder();
//   const stream = new ReadableStream({
//     async start(controller) {
//       //convert this array in a array of words
//       const messages =['This', 'is', 'a', 'mock', 'API', 'response', 'for', 'demo.', 'It', 'is', 'streamed', 'to', 'the', 'client', 'to', 'demonstrate', '[benefit', 'of', 'streaming,', 'e.g.,', 'reduced', 'latency,', 'handling', 'large', 'data].', 'You', 'can', 'add', 'more', 'messages', 'here', 'to', 'simulate', 'different', 'data', 'points', 'or', 'events.', 'This', 'is', 'the', 'end', 'of', 'the', 'response,', 'indicating', 'a', 'successful', 'completion.'].map((word) => word + ' ');
//       for (const message of messages) {
//         controller.enqueue(encoder.encode(message));
//         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
//       }
//       controller.close();
//     },
//   });

//   return new Response(stream);
// }

export default function Index() {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  const handlePress = useCallback(async () => {
    setResponse("");
    setIsStreaming(true);

    const response = await fetch("https://streamingtest-868293417709.us-central1.run.app/"); 

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      try {
       const { value, done } = await reader.read();
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
      style={styles.View}
    >

     <Pressable onPress={handlePress} disabled={isStreaming} style={styles.Button}>
       <Text>Press me to stream!{"\n"}</Text>
     </Pressable>
     
     <Text style={styles.Text}>{response}</Text>
   </View>
  );
}

const styles = StyleSheet.create({
  Button: {
    backgroundColor: "#FFC0CB", // Soft pink color
    color: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  Text: {
    color: "black",
    fontSize: 35,
    margin: 10,
    fontWeight: "bold",
  },
  View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});