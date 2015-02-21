Job Description / Resume Parser
===============================
created by Vineet Jain

This program analyzes text from an input job description or an input resume and generates an output that consists of meaningful sentences as well as hot keywords. Meaningful sentences are determined by checking which sentences have hot keywords in them along with informative delimiters ( defined in Parser.java).

###How to Run

The user can run the program with or without an output file specified. An input file must be specified.

With an output file:

`javac -g Parser.java`

`java Parser.java <input-file> <output-file>`

Without an output file:

`javac -g Parser.java`

`java Parser.java <input-file>`

The user can also add to the system files `keywords.txt` and `verbs.txt` to allow for a more accurate analysis of the program. To do so we can run the AddToFile class

`javac -g AddToFiles.java`

`java AddToFiles`

Then follow the program's prompts.

###Testing

Use these commands to run the test cases:

`javac -g Tester.java`

`java Tester`

###Scalability

The time it takes for the program to execute and generate an output is displayed in the console after the end of execution. 

In an attempt to design a scalable parser an invariant is implemented for the system files. I make sure that both `keywords.txt` and `verbs.txt` are both sorted in alphabetical order so that the worst case runtime for determining whether a word is a hot keyword or an action verb is simply O(log n) where n is the number of words in  the system file. To prevent the user from breaking this invariant AddToFiles is implemented which allows the user to add to both system files as they please. The order of the delimiters in `delimiters.txt` does not really matter so the user can simply edit the file.

In terms of algorithm analysis, here are the places within the program that could be inefficient:
+ Reading from system files and input file, writing to output file
+ Checking if a word is a keyword or an action verb, cross referencing to the system file
+ Making sure a keyword or meaningful sentence is not marked twice
+ Checking if a keyword is contained in a string

Reading from files and writing to files is essentially done in constant time, so with a large number of input that time will be amortized. Since we maintain the invariant that both the keywords and verbs system files have to be in alphabetical order, as stated above we can search through both those files very quickly. In the program, I made use of both HashMaps and ArrayLists which have constant time access rates as well as other functions that have been fully optimized by Java. At this point the first three places of inefficiency have been optimized to the farthest.

Checking if a keyword is contained in a string may be one place that costs time because we have to walk through the whole string which can be done in linear time. The program iterates through all the lines in the input text and for each line check if a keyword is contained. This results in a worst case runtime of approximately O(n^2) where n is the size of the input document.

For a large document size, the run time is enormous but it can be optimized if the program was run in parallel. Since the program is input dependent, we can break up the input into smaller pieces using various techniques such as Map Reduce and run them in parallel. This way the run time for processing a very large document is decreased significantly.
