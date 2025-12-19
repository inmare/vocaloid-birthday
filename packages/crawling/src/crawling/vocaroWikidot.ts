import axios from "axios";
import * as cheerio from "cheerio";

async function testGetData() {
  const res = await axios.get("http://vocaro.wikidot.com/allsongs");
  const $ = cheerio.load(res.data);
  $("#page-content li > a").each((i, el) => {
    console.log($(el).attr("href"));
  });
}

testGetData();
