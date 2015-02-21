public class Tester{

	public static void testEmptyInput(){
		Parser parser = new Parser();
		parser.getInput("");
		parser.analyze();
		parser.output();
	}

	public static void testNullInput(){
		Parser parser = new Parser();
		parser.getInput(null);
		parser.analyze();
		parser.output();
	}

	public static void testNoInputFile(){
		Parser parser = new Parser("this_file_doesnt_exist.txt");
		parser.getInput();
		parser.analyze();
		parser.output();
	}

	public static void testSampleJobDescription1(){
		Parser parser = new Parser("job1.txt");
		parser.getInput();
		parser.analyze();
		parser.output();
	}

	public static void testSampleJobDescription2(){
		Parser parser = new Parser("input.txt");
		parser.getInput();
		parser.analyze();
		parser.output();
	}

	public static void testSampleResume(){
		Parser parser = new Parser("resume.txt");
		parser.getInput();
		parser.analyze();
		parser.output();
	}

	public static void main(String [] args){
		System.out.println("\n*********** Testing Empty Input **********");
		testEmptyInput();
		System.out.println("\n*********** Testing Null Input ***********");
		testNullInput();
		System.out.println("\n*********** Testing Input File Doesn't Exist *************");
		// uncommented because if file is not found, the program immediately terminates
		//testNoInputFile();
		System.out.println("\n*********** Testing Sample Job Description 1 ***********");
		testSampleJobDescription1();

		System.out.println("\n*********** Testing Sample Job Description 2 ***********");
		testSampleJobDescription2();

		System.out.println("\n*********** Testing Sample Resume ***********");
		testSampleResume();

	}
}