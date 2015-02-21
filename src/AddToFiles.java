import java.io.*;
import java.util.*;
/*
	This class has been created to all the user to add to the keywords and verbs file without breaking the invariant 
	that both of them must be sorted alphabetically.
*/
public class AddToFiles{
	
	// Takes in a type and fileName that will be edited and then prompts the user various questions to complete the task of adding to the desired file
	public static void add(String type, String fileName){
		ArrayList<String> words = new ArrayList<String>();
		try{
			BufferedReader file = new BufferedReader(new FileReader(new File(fileName)));
			String str = file.readLine();
			while(str != null){
				words.add(str.toLowerCase());
				str = file.readLine();
			}

			// takes in the input of the user until the quit sequence has been pushed
			BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
			String input = new String();
			while (!input.equals(".")){
				System.out.print("\nEnter a word to add as a " + type + " (enter . to quit): ");
				input = in.readLine();
				if (!input.equals(".")){
					if (words.contains(input)){
						System.out.println(input + " is already stored as a " + type);
					}
					else{ 
						words.add(input.toLowerCase());
					}
				}
			}
			// sorts all the words to maintain the invariant of the system files
			Collections.sort(words);

			// writeback to the system files of the newly updated list of words
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(fileName)));
			for (int i = 0; i < words.size(); i++){
				writer.write(words.get(i) + "\r\n");
			}
			writer.close();
		}
		catch(IOException e){
			System.out.println("File " + fileName + " not found");
			System.exit(0);
		}
	}

	public static void main(String[] args){
		try{
			// prompts the user on the console to enter an action that he or she wishes to execute
			BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
			String input = new String();
			while (!input.equals(".")){
				System.out.print("\nWhere do you want to add to? (Options: keyword, verb, or . to quit) >>> ");
				input = in.readLine();
				if (input.equals("keyword")){
					add("keyword", Parser.KEYWORDS_FILE);
				}
				else if (input.equals("verb")){
					add("verb", Parser.VERBS_FILE);
				}
				else if (!input.equals(".")){
					System.out.println("Please enter a proper option");
				}

			}
			System.out.println("Adding is completed");
		}
		catch(IOException e){
			System.out.println("There was an error, the program will now exit");
			System.exit(0);
		}
	}
}