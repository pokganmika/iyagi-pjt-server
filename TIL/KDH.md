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


## [181212 TIL] MVC pattern

express-generator 패키지를 사용하면 자동적으로 MVC 패턴 구조 생성 
: models, public(View), routes(Controller) 

- MVC란?
  Model View Controller의 약자로, 에플리케이션을 세가지의 역할로 구분한 소프트웨어 아키텍쳐 디자인 패턴.
  Controller의 조작을 통해 Controller는 Model을 통해서 데이터를 가져오고, 그 데이터를 바탕으로 시각적인 표현을 담당하는 View를 제어하여 클라이언트에게 전달. 
  - Controller: 사용자가 접근 한 URL에 따라서 사용자의 요청사항을 파악한 후에 그 요청에 맞는 데이터를 Model에 의뢰하고, 데이터를 View에 반영해서 사용자에게 알려준다. Model과 View 사이에서 중개자 역할을 하며, Model과 View는 직접적으로 소통하지 않는다.
  - Model: 일반적으로 데이터베이스 테이블에 대응. 
  - View: 클라이언트 측의 html/css/javascript들을 모아둔 컨테이너. 


## [181213 TIL] MySQL Migration

MySQL로 database 변경.
DB Schema 및 route별 필요한 query문 작성.


## [181214 TIL] RESTful API

REST API 작성.

- API란?
  - 서버가 정의한 인터페이스
  - HTTP requests를 사용하여 리소스에 접근하기 위해 서버와 상호작용(interact)하는 방법을 서술해 둔 규칙
- REST : API 디자인에 있어서 HTTP 프로토콜을 의도에 맞게 사용하도록 정의된 아키텍쳐 스타일
  - URI는 정보의 자원(resource)을 표현해야 한다 --> 명사형 사용
  - 자원에 대한 행위(verbs)는 HTTP Methods로 표현해야 한다
- HTTP Request Methods (CRUD)
  - POST : Creates/adds a new resource, 데이터를 서버로 제출하는 용도, 서버 상태의 변화를 일으킴
  - GET : Reads/retrieves a resource, 특정 리소스를 가져오도록 요청 
  - PUT : Updates a resource, POST와 비슷하나, 연속적인 요청시에도 같은 효과를 가져옴. 기존 데이터를 교체하는 용도로 쓰일 수 있음
  - DELETE : Deletes a resource, 리소스 삭제를 요청할 때 사용


## [181215 TIL] ORM - Sequelize

sequelize 공부 및 refactoring.

- ORM (Object-Relational Mapping) 
  OOP 관점에서 데이터베이스(RDMBS)에 저장될 데이터(record) 또한 하나의 객체이며, 이 객체와 테이블 간의 관계 설정을 통해 DB 테이블 내의 데이터를 객체로 전달받아 사용 가능. 따라서 이와 같은 객체 지향적인 코드로 인해 절차적이며 순차적인 접근이 요구되는 SQL보다 더 직관적, 높은 생산성. 각 객체에 대한 코드를 독립적으로 작성하기 때문에, 해당 객체들의 재사용 및 유지보수 편의성이 증가하며 MVC 디자인 패턴에도 유리. 또한 ORM 솔루션은 DB에 종속적이지 않기 때문에, DBMS 교체 작업에도 비교적 적은 리스크와 시간 소요.
- MySQL & sequelize를 이용한 CRUD operations 및 Data validation 실습.
- MVC 프레임워크를 기반으로 한 express.js에서의 sequelize 연동 방법 - 모델 정의 및 모듈 불러오기
  [ 참고 ] https://sequelize.readthedocs.io/en/1.7.0/articles/express/