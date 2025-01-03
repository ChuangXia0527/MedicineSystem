package com.itheima.medicinesystem.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Result {

    public static final String CODE_SUCCESS = "200";//请求成功
    public static final String CODE_AUTH_ERROR = "401";//权限错误
    public static final String CODE_SYS_ERROR = "500";//系统错误

    private String code;//状态码
    private String msg;//消息
    private Object data;//数据


    public static Result success() {
        return new Result(CODE_SUCCESS, "请求成功", null);
    }

    public static Result success(Object data) {
        return new Result(CODE_SUCCESS, "请求成功", data);
    }

    public static Result error(String msg) {
        return new Result(CODE_SYS_ERROR, msg, null);
    }

    public static Result error(String code, String msg) {
        return new Result(code, msg, null);
    }

    public static Result error() {
        return new Result(CODE_SYS_ERROR, "系统错误", null);
    }

    public static Result failure(String s) {

        return new Result(CODE_AUTH_ERROR, s, null);
    }
}