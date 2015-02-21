package PDFtoTxt;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.util.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;

public class App {
	public static void main(String[] args) {

		PDDocument pd;
		BufferedWriter wr;
		try {
			String workingDirectory = System.getProperty("user.dir");
			System.out.println(workingDirectory);
			File input = new File("Yan.pdf"); // The PDF file from where
														// you would like to
														// extract
			File output = new File("Yan.txt"); // The text file where
															// you are going to
															// store the
															// extracted data
			pd = PDDocument.load(input);
			System.out.println(pd.getNumberOfPages());
			System.out.println(pd.isEncrypted());
			pd.save("CopyOfInvoice.pdf"); // Creates a copy called
											// "CopyOfInvoice.pdf"
			PDFTextStripper stripper = new PDFTextStripper();
			wr = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(output)));
			stripper.writeText(pd, wr);
			if (pd != null) {
				pd.close();
			}
			// I use close() to flush the stream.
			wr.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
