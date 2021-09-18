/*
 * @Descripttion: 二叉树的前序遍历
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-06-21 15:16:57
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-06-22 11:22:37
 */

// leetcode 144 https://leetcode-cn.com/problems/binary-tree-preorder-traversal/
/**
给你二叉树的根节点 root ，返回它节点值的 前序 遍历。

输入：root = [1,null,2,3]
输出：[1,2,3]

输入：root = []
输出：[]

输入：root = [1]
输出：[1]

输入：root = [1,2]
输出：[1,2]

输入：root = [1,null,2]
输出：[1,2]
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

// 方法一：通过栈遍历
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
 var preorderTraversal = function(root) {
    if(!root) return []
    const res = []
    const stack = []
    stack.push(root)
    while(stack.length) {
        const node = stack.pop()
        res.push(node.val)

        if(node.right){
            stack.push(node.right)
        }
        if(node.left){
            stack.push(node.left)
        }
    }
    return res 
};

// 方法二： 递归
var preorderTraversal = function(root) {
    if(!root) return []
    const res = []
    const fn = function(node, res) {
        if (!node) return
        res.push(node.val)
        preorder(node.left, res)
        preorder(node.right, res) 
    }
    fn(root, res)
    return res 
};