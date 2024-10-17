import * as fs from 'fs';
import * as path from 'path';

interface Movie {
  title: string;
  calendar?: string;
  comment?: string;
}

function updateComments() {
  try {
    // 读取两个 JSON 文件
    const cal2024Path = path.resolve(__dirname, '../data/movies/cal2024.json');
    const doubanCalendarPath = path.resolve(
      __dirname,
      '../data/movies/douban-movie-calendar-2024.json'
    );

    const cal2024Data: Movie[] = JSON.parse(fs.readFileSync(cal2024Path, 'utf8'));
    const doubanCalendarData: Movie[] = JSON.parse(fs.readFileSync(doubanCalendarPath, 'utf8'));

    // 创建日期到评论的映射
    const dateToCommentMap = new Map<string, string>();

    // 处理豆瓣日历数据
    doubanCalendarData.forEach(movie => {
      if (movie.comment) {
        const match = movie.comment.match(/^(\d{4}-\d{2}-\d{2})｜(.+)$/);
        if (match) {
          const [, date, comment] = match;
          dateToCommentMap.set(date, comment);
        }
      }
    });

    // 更新 cal2024 的评论
    cal2024Data.forEach(movie => {
      if (movie.calendar) {
        const newComment = dateToCommentMap.get(movie.calendar);
        if (newComment) {
          movie.comment = newComment;
        }
      }
    });

    // 写回文件
    fs.writeFileSync(cal2024Path, JSON.stringify(cal2024Data, null, 2));
    console.log('评论更新完成');
  } catch (error) {
    console.error('更新评论时发生错误:', error);
  }
}

updateComments();
