package Model;

import com.aliasi.spell.JaccardDistance;
import com.aliasi.tokenizer.IndoEuropeanTokenizerFactory;
import com.aliasi.tokenizer.TokenizerFactory;

/**
 * Created by kanghuang on 2/21/15.
 */
public class Analyzer {
    TokenizerFactory tokenizerFactory = IndoEuropeanTokenizerFactory.INSTANCE;
    JaccardDistance jaccard = new JaccardDistance(tokenizerFactory);

}
