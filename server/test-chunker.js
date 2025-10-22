const chunkText = require('./utils/textChunker');

// Test with a long sample text
const sampleText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term "artificial intelligence" is often used to describe machines (or computers) that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving". As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect. A quip in Tesler's Theorem says "AI is whatever hasn't been done yet." For instance, optical character recognition is frequently excluded from things considered to be AI, having become a routine technology. Modern machine learning statistical techniques are effective at helping software developers to create systems that perform tasks which are difficult for humans to program explicitly. Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention. The iterative aspect of machine learning is important because as models are exposed to new data, they are able to independently adapt. They learn from previous computations to produce reliable, repeatable decisions and results. While many machine learning algorithms have been around for a long time, the ability to automatically apply complex mathematical calculations to big data over and over, faster and faster is a recent development. Machine learning algorithms build a mathematical model based on training data, in order to make predictions or decisions without being explicitly programmed to do so. Machine learning algorithms are used in a wide variety of applications, such as in medicine, email filtering, speech recognition, and computer vision, where it is difficult or unfeasible to develop conventional algorithms to perform the needed tasks. Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Learning can be supervised, semi-supervised or unsupervised. Deep learning architectures such as deep neural networks, deep belief networks, recurrent neural networks and convolutional neural networks have been applied to fields including computer vision, speech recognition, natural language processing, audio recognition, social network filtering, machine translation, bioinformatics, drug design, medical image analysis, material inspection and board game programs, where they have produced results comparable to and in some cases superior to human experts. Deep learning models are inspired by information processing and communication patterns in biological nervous systems but they have various differences from the structural and functional properties of biological brains, especially the human brain, which make them incompatible with neuroscience evidences. Neural networks are computing systems inspired by biological neural networks. These systems learn to perform tasks by considering examples, generally without being programmed with any task-specific rules. For example, in image recognition, they might learn to identify images that contain cats by analyzing example images that have been manually labeled as "cat" or "no cat" and using the results to identify cats in other images. They do this without any prior knowledge about cats, for example, that they have fur, tails, whiskers, and cat-like facial features. Instead, they automatically generate identifying characteristics from the learning material that they process. An artificial neural network is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain. Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. An artificial neuron that receives a signal then processes it and can signal neurons connected to it. The "signal" at a connection is a real number, and the output of each neuron is computed by some non-linear function of the sum of its inputs. Connections are called edges. Neurons and edges typically have a weight that adjusts as learning proceeds. The weight increases or decreases the strength of the signal at a connection. Neurons may have a threshold such that the signal is only sent if the aggregate signal crosses that threshold. Typically, neurons are aggregated into layers. Different layers may perform different transformations on their inputs. Signals travel from the first layer (the input layer), to the last layer (the output layer), possibly after traversing the layers multiple times. The original goal of the neural network approach was to solve problems in the same way that a human brain would. However, over time, attention moved to performing specific tasks, leading to deviations from biology. Artificial neural networks have been used on a variety of tasks, including computer vision, speech recognition, machine translation, social network filtering, playing board and video games and medical diagnosis. As of 2017, neural networks typically have a few thousand to a few million units and millions of connections. Although this number is several orders of magnitude less than the number of neurons in a human brain, these networks can perform many tasks at a level that exceeds human performance (e.g., recognizing faces, playing "Go"). Recurrent neural networks (RNNs) are a class of neural networks where connections between nodes form a directed graph along a temporal sequence. This allows it to exhibit temporal dynamic behavior. Derived from feedforward neural networks, RNNs can use their internal state (memory) to process variable length sequences of inputs. This makes them applicable to tasks such as unsegmented, connected handwriting recognition or speech recognition. The term "recurrent neural network" is used to refer to the class of networks with an infinite impulse response. Conversely, "finite impulse response" is used to describe the class of networks with a finite impulse response. Convolutional neural networks (CNNs) are a class of deep neural networks, most commonly applied to analyzing visual imagery. They are also known as shift invariant or space invariant artificial neural networks (SIANN), based on their shared-weights architecture and translation invariance characteristics. CNNs are regularized versions of multilayer perceptrons. Multilayer perceptrons usually mean fully connected networks, that is, each neuron in one layer is connected to all neurons in the next layer. The "fully-connectedness" of these networks makes them prone to overfitting data. Typical ways of regularization, or preventing overfitting, include: penalizing parameters during training, such as weight decay, or trimming connectivity (skipped connections, being equivalent to a sparse weight matrix) between layers, as in dropout regularization. CNNs take a different approach towards regularization: they take advantage of the hierarchical pattern in data and assemble patterns of increasing complexity using smaller and simpler patterns. Therefore, on the scale of connectedness and complexity, CNNs are on the lower extreme. Convolutional networks were inspired by biological processes in that the connectivity pattern between neurons resembles the organization of the animal visual cortex. Individual cortical neurons respond to stimuli only in a restricted region of the visual field known as the receptive field. The receptive fields of different neurons partially overlap such that they cover the entire visual field. CNNs use relatively little pre-processing compared to other image classification algorithms. This means that the network learns the filters that in traditional algorithms were hand-engineered. This independence from prior knowledge and human effort in feature design is a major advantage. They have applications in image and video recognition, recommender systems, image classification, medical image analysis, and natural language processing.
`;

console.log('=== Text Chunking Test ===\n');

// Test with default maxWords (700)
console.log('Test 1: Default chunking (maxWords = 700)');
const chunks1 = chunkText(sampleText, 700);
console.log(`Total chunks: ${chunks1.length}`);
chunks1.forEach((chunk, index) => {
  console.log(`\nChunk ${chunk.id}:`);
  console.log(`Word count: ${chunk.wordCount}`);
  console.log(`Preview: ${chunk.chunkText.substring(0, 100)}...`);
});

console.log('\n' + '='.repeat(50) + '\n');

// Test with smaller chunks
console.log('Test 2: Smaller chunks (maxWords = 200)');
const chunks2 = chunkText(sampleText, 200);
console.log(`Total chunks: ${chunks2.length}`);
chunks2.forEach((chunk, index) => {
  console.log(`\nChunk ${chunk.id}:`);
  console.log(`Word count: ${chunk.wordCount}`);
  console.log(`Preview: ${chunk.chunkText.substring(0, 80)}...`);
});

console.log('\n' + '='.repeat(50) + '\n');

// Test with very small chunks
console.log('Test 3: Very small chunks (maxWords = 50)');
const chunks3 = chunkText(sampleText, 50);
console.log(`Total chunks: ${chunks3.length}`);
chunks3.forEach((chunk, index) => {
  console.log(`\nChunk ${chunk.id}:`);
  console.log(`Word count: ${chunk.wordCount}`);
  console.log(`Preview: ${chunk.chunkText.substring(0, 60)}...`);
});

console.log('\n' + '='.repeat(50) + '\n');

// Test edge cases
console.log('Test 4: Edge cases');
console.log('Empty string:', chunkText(''));
console.log('Null input:', chunkText(null));
console.log('Single word:', chunkText('Hello'));
console.log('Single sentence:', chunkText('This is a single sentence with multiple words.'));

// Test with a very long sentence that exceeds maxWords
const longSentence = 'This is a very long sentence that contains many words and should be split by words when it exceeds the maximum word limit because it does not contain any sentence-ending punctuation marks like periods or exclamation points or question marks which would allow for proper sentence-based splitting.';
console.log('\nLong sentence test (maxWords = 20):');
const longChunks = chunkText(longSentence, 20);
longChunks.forEach((chunk, index) => {
  console.log(`Chunk ${chunk.id}: ${chunk.wordCount} words - "${chunk.chunkText}"`);
});
