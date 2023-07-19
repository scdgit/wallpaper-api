import mysql from 'mysql2'

import type { UserTyle } from '../type'
import { dbconfig } from '../config'

// 创建数据库连接
const pool = mysql.createPool({
   ...dbconfig,
   // connectionLimit: 10 // 可选参数，指定连接池中的最大连接数
})

const promisePool = pool.promise() // 将连接池转换成Promise风格的API

/**
 * 查询数据库
 * @param sql 查询的语句
 * @returns 
 */
export const selectDate = (sql: string): Promise<Array<UserTyle>> => {
   return new Promise(async (resolve, reject) => {
      try {
         const [rows] = await promisePool.query(sql)
         console.log(rows)
         resolve((rows as Array<UserTyle>))
      } catch (error: any) {
         reject(error.message)
      }
   })
}

/**
 * 插入数据库
 * @param table [STRING] 表名
 * @param data [OBJECT] 数据
 * @returns
 */
export const insertData = (table: string, data: object) => {
   return new Promise(async (resolve, reject) => {
      try {
         const query = `INSERT INTO ${table} SET ?`;
         const result: any = await promisePool.query(query, data);
         resolve({ msg: 'insert:ok', insertId: result[0].insertId })
      } catch (error: any) {
         reject(error.message)
      }
   })
}

/**
 * 删除一条数据
 * @param table [STRING] 表
 * @param condition [STRING] 条件
 * @returns 是否删除成功 [BOOLEAN]
 */
export const deleteData = (table: string, condition: string) => {
   return new Promise(async (resolve, reject) => {
      try {
         const query = `DELETE FROM ${table} WHERE ${condition}`
         const result: any = await promisePool.query(query)
         resolve(result[0].affectedRows > 0)
      } catch (error: any) {
         reject(error.message)
      }
   })
}

/**
 * 修改一条数据
 * @param table [STRING] 表
 * @param data [OBJECT] 修改的数据
 * @param condition [STRING] 条件
 * @returns 是否修改成功 [BOOLEAN]
 */
export const updateData = (table: string, data: object, condition: string) => {
   return new Promise(async (resolve, reject) => {
      try {
         const query = `UPDATE ${table} SET ? WHERE ${condition}`
         const result: any = await promisePool.query(query, data)
         resolve(result[0].affectedRows > 0)
      } catch (error: any) {
         reject(error.message)
      }
   })
}