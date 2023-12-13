
const express = require("express");
const bodyParser = require("body-parser");
//Здесь подключается модуль body-parser, который позволяет разбирать тело запроса, включая JSON, URL-кодированные данные и другие форматы.


const app = express();
//экземпляр будет использоваться для создания и настройки сервера

// Парсинг JSON-тела запроса
app.use(bodyParser.json());
//bodyParser для обработки JSON-тела запроса. Оно будет автоматически вызываться для каждого входящего запроса, чтобы парсить JSON-данные 
//и делать их доступными в виде объекта req.body.

const posts = [];
//Здесь создается пустой массив posts, который будет использоваться для хранения постов.
// GET-запрос для получения всех постов
app.get("/api/posts", (_, res) => {
   res.json(posts);
});
// Устанавливается GET-обработчик для /api/posts, который возвращает весь массив постов в формате JSON.


// GET-запрос для получения одного поста по ID
app.get("/api/posts/:id", (req, res) => {//Двоеточие (:id) в маршруте указывает, что это  часть маршрута и будет доступна в req.params с именем id.
   //req (объект запроса) и res (объект ответа)
   const postId = req.params.id;// Здесь извлекается значение id из параметров маршрута. Это позволяет получить идентификатор поста, указанный в URL.
   const post = posts.find((p) => p.id == postId);//я метод find на массиве posts для поиска поста с идентификатором, указанным в req.params.id.
   if (post) {
      res.json(post);// результат поиска. Если пост с указанным идентификатором найден, он отправляется в формате JSON в качестве ответа
   } else {
      res.status(404).json({ error: "Post not found" });
   }
});
//Устанавливается GET-обработчик для /api/posts/:id, который возвращает пост с определенным id. Если пост не найден, отправляется ответ 
//со статусом 404 и сообщением об ошибке

// POST-запрос для создания нового поста
app.post("/api/posts", (req, res) => {
   const { author, age, content, picture } = req.body;
   // Здесь деструктурируются данные из тела запроса, чтобы извлечь значения author, age, content и picture.

   if (!author || !age || !content) {//В этой части проверяется, есть ли все обязательные поля в данных, которые пришли в теле запроса. Если какое-либо из полей отсутствует, сервер отправляет ответ со статусом 400 и сообщением об ошибке в формате JSON.
      res.status(400).json({ error: "Missing required fields" });
   } else {
      const newPost = {
         id: Date.now().toString(),
         author,
         age,
         content,
         picture,
      };
      posts.push(newPost);
      res.json(newPost);
   }
});
//Устанавливается POST-обработчик для /api/posts, который создает новый пост из данных в запросе, если все обязательные поля указаны, 
//иначе отправляет ответ со статусом 400 и сообщением об ошибке



app.put("/api/posts/:id", (req, res) => {
   const postId = req.params.id;// Здесь извлекается значение id из параметров маршрута
   const { author, age, content, picture } = req.body;
   const post = posts.find((p) => p.id == postId);//: Это поиск поста по указанному идентификатору.
   if (post) {
      post.author = author || post.author;
      post.age = age || post.age;
      post.content = content || post.content;
      post.picture = picture || post.picture;
      res.json(post);
      // использование логического оператора || для обновления значений только в том случае, если новое значение предоставлено.
   } else {
      res.status(404).json({ error: "Post not found" });
   }
});
//устанавливается PUT-обработчик для /api/posts/:id, который обновляет данные поста по указанному id.
//

app.delete("/api/posts/:id", (req, res) => {
   const postId = req.params.id;
   const index = posts.findIndex((p) => p.id == postId);
   //: Находится индекс поста с указанным идентификатором в массиве posts.
   if (index !== -1) {
      const deletedPost = posts.splice(index, 1)[0];
      res.json(deletedPost);
   } else {
      res.status(404).json({ error: "Post not found" });
   }
});
//Устанавливается DELETE-обработчик для /api/posts/:id, который удаляет пост по указанному id.

app.listen(3000, () => {
   console.log("  The server is running");
});