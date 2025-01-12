package com.fakerank.submission.utils;

import java.util.HashMap;
import java.util.Map;

public class Judge0Util {
    private final static Map<String, Integer> languages = new HashMap<>();

    static {
        languages.put("python", 71);
        languages.put("cpp", 54);
        languages.put("java", 62);
        languages.put("javascript", 63);
        languages.put("c", 50);
    }

    public  final String AUTHN_HEADER = "X-Auth-Token";

    public static final String AUTHZ_HEADER = "X-Auth-User";

    public static final String AUTHN_TOKEN = "";

    public static final String AUTHZ_TOKEN = "gyekugrqpsjfcqznsqvyhvjel";

    public static Integer getLanguage_id(String language) {
        return languages.get(language);
    }

}
