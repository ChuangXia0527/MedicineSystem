package com.itheima.medicinesystem.Entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.Setter;

@Data
@TableName("medicine")//指定表名
public class Medicine {
    @Setter
    @TableId(type = IdType.AUTO)//指定主键
    public Integer mno;//药品编号
    public String mname;//药品名称
    public String mmode;//用法 内服or外用
    public String mefficacy;//功效

}
