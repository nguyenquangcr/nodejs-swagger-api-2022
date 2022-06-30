const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 *components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - birthday
 *         - phoneNumber
 *       properties:
 *         firstName:
 *           type: string
 *           description: Tên đầu của người dùng
 *         lastName:
 *           type: string
 *           description: Tên cuối của người dùng
 *         email:
 *           type: string
 *           description: Email người dùng
 *         password:
 *           type: string
 *           description: Mật khẩu người dùng
 *         birthday:
 *           type: string
 *           description: Mô tả người dùng
 *         phoneNumber:
 *           type: string
 *           description: Số điện thoại người dùng
 *       example:
 *         firstName: zzzzz
 *         lastName: Nguyễn
 *         email: hoa@ncc.asia
 *         password: "12345678"
 *         birthday: 2022-02-04 00:00:00
 *         phoneNumber: "09090909090"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movies:
 *       type: object
 *       required:
 *         - name
 *         - trailer
 *         - poster
 *         - description
 *         - startTime
 *         - evaluate
 *       properties:
 *         name:
 *           type: string
 *           description: Tên phim
 *         trailer:
 *           type: string
 *           description: Link trailer phim
 *         poster:
 *           type: string
 *           description: Link poster phim
 *         description:
 *           type: string
 *           description: Tiêu đề phim
 *         startTime:
 *           type: string
 *           description: Thời gian bắt đầu phim
 *         evaluate:
 *           type: string
 *           description: none
 *       example:
 *         name: hồi chuông lạ
 *         trailer: https://www.youtube.com/watch?v=u34gHaRiBIU
 *         poster: poster
 *         description: Hồi Chuông Lạ - From lấy bối cảnh tại một thị trấn u ám, hoang văng ở miền trung nước Mỹ. Khi nơi đây đang xảy một hiện tượng vô cùng kỳ lạ.
 *         startTime: 2022-02-04 00:00:00
 *         evaluate: "5"
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

router.get("/", (req, res) => {
  const books = req.app.db.get("books");

  res.send(books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

router.get("/:id", (req, res) => {
  const book = req.app.db.get("books").find({ id: req.params.id }).value();

  if (!book) {
    res.sendStatus(404);
  }

  res.send(book);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
  try {
    const book = {
      id: nanoid(idLength),
      ...req.body,
    };

    req.app.db.get("books").push(book).write();

    res.send(book);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
  try {
    req.app.db
      .get("books")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();

    res.send(req.app.db.get("books").find({ id: req.params.id }));
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

router.delete("/:id", (req, res) => {
  req.app.db.get("books").remove({ id: req.params.id }).write();

  res.sendStatus(200);
});

/**
 * @swagger
 * tags:
 *   name: QuanLyNguoiDung
 *   description: User Management Api
 */

/**
 * @swagger
 * /users?current=&pageSize=&search=:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [QuanLyNguoiDung]
 *     parameters:
 *       - in: query
 *         name: current
 *         schema:
 *           type: integer
 *         required: false
 *         description: The current page
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page size
 *       - in: query
 *         name: search
 *         schema:
 *           type: integer
 *         required: false
 *         description: Search name users
 *     responses:
 *       200:
 *         description: The users was deleted
 *         headers:
 *              Access-Control-Allow-Origin:
 *                                  type: string
 *       404:
 *         description: The users was not found
 *
 */

/**
 * @swagger
 * /users/detail?id=:
 *   get:
 *     summary: Lấy thông tin chi tiết người dùng
 *     tags: [QuanLyNguoiDung]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: id user
 *     responses:
 *       200:
 *         description: get info user success
 *         headers:
 *              Access-Control-Allow-Origin:
 *                                  type: string
 *       404:
 *         description: The user was not found
 *
 */

/**
 * @swagger
 * /users/history:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Thông tin tài khoản
 *     tags: [QuanLyNguoiDung]
 *     parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *         required: true
 *         example: Bearer TokenDMC
 *     responses:
 *       200:
 *         description: get info account success
 *       404:
 *         description: The user was not found
 *
 */

/**
 * @swagger
 * /users/sign-up:
 *   post:
 *     summary: Thêm người dùng
 *     tags: [QuanLyNguoiDung]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The users was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/sign-in:
 *   post:
 *     summary: Đăng nhập
 *     tags: [QuanLyNguoiDung]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *              email: hoa@ncc.asia
 *              password: "12345678"
 *     responses:
 *       200:
 *         description: The users was successfully created
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật người dùng
 *     tags: [QuanLyNguoiDung]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The users was successfully update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xoá người dùng
 *     tags: [QuanLyNguoiDung]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

/**
 * @swagger
 * tags:
 *   name: QuanLyPhim
 *   description: Movie Management Api
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Thêm phim
 *     tags: [QuanLyPhim]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movies'
 *     responses:
 *       200:
 *         description: The Movies was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Lấy danh sách tất cả phim
 *     tags: [QuanLyPhim]
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movies'
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết bộ phim theo id
 *     tags: [QuanLyPhim]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: The movies id
 *     responses:
 *       200:
 *         description: The movies description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       404:
 *         description: The movies was not found
 */

/**
 * @swagger
 * /movies/{id}:
 *  put:
 *    summary: Cập nhật phim theo id
 *    tags: [QuanLyPhim]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id của bộ phim
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movies'
 *    responses:
 *      200:
 *        description: Bộ phim đã được cập nhật
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movies'
 *      404:
 *        description: The movies was not found
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Xoá phim
 *     tags: [QuanLyPhim]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id phim
 *
 *     responses:
 *       200:
 *         description: The movie was deleted
 *       404:
 *         description: The movie was not found
 */

module.exports = router;
