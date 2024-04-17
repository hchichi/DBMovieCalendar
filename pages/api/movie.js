// pages/api/movie.js
export default function handler(req, res) {
    const movies = [
         {
            "title": "功夫熊猫3 Kung Fu Panda 3",
            "link": "https://movie.douban.com/subject/11589036/",
            "image": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2306653420.jpg",
            "rating": "7.8",
            "comment": "2024-01-01｜—— “你是谁？” —— “我也一直在问同一个问题。我是熊猫的儿子？ 一只鹅的儿子？ 一位学生？还是一位老师？结果这些都是我。我是神龙大侠。”｜元旦"
        },
        // 更多电影数据...
    ];
    
    const today = new Date().toISOString().slice(0, 10); // 获取当前日期 YYYY-MM-DD
    const movieOfToday = movies.find(movie => movie.comment.includes(today));

    if (movieOfToday) {
        res.status(200).json(movieOfToday);
    } else {
        res.status(404).json({ error: "没有找到今天的电影" });
    }
}