## [181208 TIL] express-generator 이용한 서버 구동

express-generator 패키지를 통한 서버 구동 및 create-react-app과의 연동 테스트.
express-generator를 사용하면, 어플리케이션의 기본 구조를 자동으로 생성(서버 설정, 필수 미들웨어 및 라우트 정의), 실행만을 통한 서버 작동 가능.


## [181210 TIL] MongoDB + mongoose 공부 

Udemy에서 'Node.js: The Complete Guide to Build RESTful APIs' 강좌 들으면서 공부.

- MongoDB는 NoSQL로, relational database의 tables & rows 가 MongoDB에서는 collections & documents로 대치되며, 각 document는 key-value pair 형태를 지닌다.
- Mongoose라는 ODM 라이브러리의 schema를 이용하여 MongoDB collection의 documents를 정의할 수 있다.
- MongoDB & mongoose를 이용한 CRUD operations 및 Data validation 연습.
- Modelling Relationships 
  - 방법 1) Using References (Normalization) ---> CONSISTENCY
  - 방법 2) Using Embedded Documents (Denormalization) ---> PERFORMANCE
- Authentication & Authorization 공부.


## [181211 TIL] 

- server-side 폴더 구조 정리 : models, routes, middleware, client(static file)
- mongoose 사용하여 DB schema 설계
- server-client repository 연결 테스트
  - `git submodule` 커맨드 사용하여 client repository를 server repository의 submodule로 clone.
  - server repository에서 build한 static 파일 serve. (각자 repo에서 개발 후, `git submodule update` 커맨드로 병합 가능)
  - client side에 proxy 설정을 통해 server-side의 5000번 port와 client-side의 3000번 port 둘 다 사용 가능.

## [181212 TIL] 
MongoDB connection 설정
GET / POST router 일부 구현

## [181213 TIL] 
MySQL로 database 변경

## [181214 TIL] 
RESTful API

## [181215 TIL] 
sequelize 공부 및 refactoring
