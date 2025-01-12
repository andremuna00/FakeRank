package com.fakerank.codeExecution.utils;

import org.json.*;

public class CreateSubmissionBody {

    final private JSONObject body_json;
    private String source_code;

    private int language_id;

    private String compiler_options;

    private String command_line_arguments;

    private  String stdin;

    private String expected_output;

    private float cpu_time_limit;

    private float cpu_extra_time;

    private  float wall_time_limit;

    private  float memory_limit;

    private int stack_limit;

    private  int max_processes_and_or_threads;

    private  boolean enable_per_process_and_thread_time_limit;

    private  boolean enable_per_process_and_thread_memory_limit;

    private int max_file_size;

    private  int redirect_stderr_to_stdout;

    private  boolean enable_network;

    private  int number_of_runs;

    private String additional_files;

    private String callback_url;

    public JSONObject getBody_json() {
        return body_json;
    }

    public CreateSubmissionBody(int language_id, String source_code) {
        this.source_code = source_code;
        this.language_id = language_id;

        this.body_json = new JSONObject();
        this.body_json.put("source_code", this.source_code).put("language_id", this.language_id);
    }

    public void setSource_code(String source_code) {
        this.source_code = source_code;
        this.body_json.put("source_code",this.source_code);
    }

    public void setLanguage_id(int language_id) {
        this.language_id = language_id;
        this.body_json.put("language_id",this.language_id);
    }

    public void setCompiler_options(String compiler_options) {
        this.compiler_options = compiler_options;
        this.body_json.put("compiler_options",this.compiler_options);
    }

    public void setCommand_line_arguments(String command_line_arguments) {
        this.command_line_arguments = command_line_arguments;
        this.body_json.put("command_line_arguments",this.command_line_arguments);
    }

    public void setStdin(String stdin) {
        this.stdin = stdin;
        this.body_json.put("stdin",this.stdin);
    }

    public void setExpected_output(String expected_output) {
        this.expected_output = expected_output;
        this.body_json.put("expected_output",this.expected_output);
    }

    public void setCpu_time_limit(float cpu_time_limit) {
        this.cpu_time_limit = cpu_time_limit;
        this.body_json.put("cpu_time_limit",this.cpu_time_limit);
    }

    public void setCpu_extra_time(float cpu_extra_time) {
        this.cpu_extra_time = cpu_extra_time;
        this.body_json.put("cpu_extra_time",this.cpu_extra_time);
    }

    public void setWall_time_limit(float wall_time_limit) {
        this.wall_time_limit = wall_time_limit;
        this.body_json.put("wall_time_limit",this.wall_time_limit);
    }

    public void setMemory_limit(float memory_limit) {
        this.memory_limit = memory_limit;
        this.body_json.put("memory_limit",this.memory_limit);
    }

    public void setStack_limit(int stack_limit) {
        this.stack_limit = stack_limit;
        this.body_json.put("stack_limit",this.stack_limit);
    }

    public void setMax_processes_and_or_threads(int max_processes_and_or_threads) {
        this.max_processes_and_or_threads = max_processes_and_or_threads;
        this.body_json.put("max_processes_and_or_threads",this.max_processes_and_or_threads);
    }

    public void setEnable_per_process_and_thread_time_limit(boolean enable_per_process_and_thread_time_limit) {
        this.enable_per_process_and_thread_time_limit = enable_per_process_and_thread_time_limit;
        this.body_json.put("enable_per_process_and_thread_time_limit",this.enable_per_process_and_thread_time_limit);
    }

    public void setEnable_per_process_and_thread_memory_limit(boolean enable_per_process_and_thread_memory_limit) {
        this.enable_per_process_and_thread_memory_limit = enable_per_process_and_thread_memory_limit;
        this.body_json.put("enable_per_process_and_thread_memory_limit",this.enable_per_process_and_thread_memory_limit);
    }

    public void setMax_file_size(int max_file_size) {
        this.max_file_size = max_file_size;
        this.body_json.put("max_file_size",this.max_file_size);
    }

    public void setRedirect_stderr_to_stdout(int redirect_stderr_to_stdout) {
        this.redirect_stderr_to_stdout = redirect_stderr_to_stdout;
        this.body_json.put("redirect_stderr_to_stdout",this.redirect_stderr_to_stdout);
    }

    public void setEnable_network(boolean enable_network) {
        this.enable_network = enable_network;
        this.body_json.put("enable_network",this.enable_network);
    }

    public void setNumber_of_runs(int number_of_runs) {
        this.number_of_runs = number_of_runs;
        this.body_json.put("number_of_runs",this.number_of_runs);
    }

    public void setAdditional_files(String additional_files) {
        this.additional_files = additional_files;
        this.body_json.put("additional_files",this.additional_files);
    }

    public void setCallback_url(String callback_url) {
        this.callback_url = callback_url;
        this.body_json.put("callback_url",this.callback_url);
    }
}
