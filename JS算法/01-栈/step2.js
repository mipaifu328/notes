/*
 * @Descripttion: 有效括号 
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-06-21 11:38:54
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-06-22 11:22:24
 */

// leetcode 20 https://leetcode-cn.com/problems/valid-parentheses/
/**
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
 
输入：s = "()"
输出：true

输入：s = "()[]{}"
输出：true

输入：s = "(]"
输出：false

输入：s = "([)]"
输出：false

输入：s = "{[]}"
输出：true
 */

/**
 解题思路：
 新建一个栈
 遍历字符串，遇到左括号入栈，遇到栈顶括号类型匹配的右括号就出栈
 栈为空则合法
 */

/**
 * @param {string} s
 * @return {boolean}
 */
// 方法一
var isValid = function(s) {
    if(s.length % 2 === 1){
        return false
    }
    let stack = []
    for(let i = 0, len = s.length; i< len; i++) {
        if(s[i] === '(' || s[i] === '[' || s[i] === '{') {
            stack.push(s[i])
        }else{
            let stackTop = stack.pop();
            if(!((stackTop === '(' && s[i] === ')') ||
                (stackTop === '[' && s[i] === ']') ||
                (stackTop === '{' && s[i] === '}'))
            ){
                return false
            } 
        }
    }
    return stack.length === 0
};

// 方法2
var isValid = function(s) {
    if(s.length % 2 === 1){
        return false
    }
    const stack = [], 
        map = {
            "(":")",
            "{":"}",
            "[":"]"
        };
    for(const x of s) {
        if(x in map) {
            stack.push(x);
            continue;
        };
        if(map[stack.pop()] !== x) return false;
    }
    return !stack.length;
};

// 方法三
var isValid = function(s) {
    if(s.length % 2 === 1){
        return false
    }
    while(s.length > 0) {
        const template = s
        s = s.replace('()', '').replace('[]', '').replace('{}', '')
        if(s === template){
            return false
        }
    }
    return s.length === 0
};


console.log(isValid('))'))