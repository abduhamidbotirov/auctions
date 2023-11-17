import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
    user: process.env.PG_USER as string,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE as string,
    host: process.env.PG_HOST as string,
    password: process.env.PG_PASSWORD as string,
});
async function fetch(queryString: string, ...params: any[]): Promise<any> {
    const client = await pool.connect();
    try {
        const {
            rows: [data],
        } = await client.query(queryString, params || []);
        return data;
    } catch (err: any) {
        console.error(err.message);
    } finally {
        console.log("data");
        client.release();
    }
}
async function fetchAll(queryString: string): Promise<any[]> {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(queryString);
        return rows;
    } catch (err: any) {
        console.error(err.message);
        return []; // Return an empty array in case of an error
    } finally {
        console.log("datas");
        client.release();
    }
}


export { fetch, fetchAll };
