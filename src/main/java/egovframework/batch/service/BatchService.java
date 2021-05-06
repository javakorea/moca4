package egovframework.batch.service;

import java.util.Map;

public interface BatchService {
	public void regist() throws Exception;
	public void receipt(Map mapvo) throws Exception;
	public void writeErrorLog(Map mapvo) throws Exception;
}

