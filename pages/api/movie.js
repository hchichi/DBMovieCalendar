// pages/api/movie.js
import movies from '../../data/movies.json';

export default function handler(req, res) {
    const today = new Date().toISOString().slice(0, 10); // 获取当前日期 YYYY-MM-DD

    // 处理每个电影对象，提取 chineseTitle、originalTitle 和 date，并生成 datecomment
    const processedMovies = movies.map(movie => {
        // 提取 chineseTitle 和 originalTitle
        const titleParts = movie.title.split(' ');
        let chineseTitle = '';
        let originalTitle = '';

        if (titleParts.length > 1) {
            chineseTitle = titleParts[0].trim();
            originalTitle = titleParts.slice(1).join(' ').trim();
        } else {
            chineseTitle = movie.title.trim();
            originalTitle = '';
        }

        // 提取 date 和 mainComment（从 comment 中提取 YYYY-MM-DD）
        const commentParts = movie.comment.split('｜');
        const date = commentParts[0].trim();
        const mainComment = commentParts.slice(1).join('｜').trim(); // 支持有多个 '｜' 的情况

        // 生成 datecomment
        const datecomment = movie.comment.includes('｜') ? movie.comment.trim() : `${date}｜${mainComment}`;

        return {
            ...movie,
            chineseTitle,
            originalTitle,
            date,
            comment: mainComment,
            datecomment
        };
    });

    const movieOfToday = processedMovies.find(movie => movie.date === today);

    if (movieOfToday) {
        res.status(200).json(movieOfToday);
    } else {
        res.status(404).json({ error: "没有找到今天的电影" });
    }
}
