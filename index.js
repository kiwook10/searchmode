const express = require("express");
const MongoClient = require("mongodb").MongoClient;
//데이터베이스의 데이터 입력,출력을 위한 함수명령어 불러들이는 작업
const app = express();
const port = 4000;

//ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
//사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
//css/img/js(정적인 파일)사용하려면 이코드를 작성!
app.use(express.static('public'));


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret :'secret', resave : false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session()); 



let db;

MongoClient.connect("mongodb+srv://kiwook10:@@aa4087aa@@@cluster0.ig6zh8w.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("board_final");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });

});

//로그인 했을 때 검증 처리
passport.use(new LocalStrategy({
    usernameField:"memberid",
    passwordField:"memberpass",
    session:true,
    },      //해당 name값은 아래 매개변수에 저장
    function(memberid, memberpass, done) {
                    //회원정보 콜렉션에 저장된 아이디랑 입력한 아이디랑 같은지 체크                                 
      db.collection("members").findOne({ memberid:memberid }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        //비밀번호 체크 여기서 user는 db에 저장된 아이디의 비번값
        if (memberpass == user.memberpass) {
            return done(null, user)
          } else {
            return done(null, false)
          }
      });
    }
));


//처음 로그인 했을 시 세션 생성 memberid는 데이터에 베이스에 로그인된 아이디
passport.serializeUser(function (user, done) {
done(null, user.memberid)
});

//다른 페이지(서브페이지,게시판 페이지 등 로그인 상태를 계속 표기하기 위한 작업)
//로그인이 되있는 상태인지 체크
passport.deserializeUser(function (memberid, done) {
db.collection('members').findOne({memberid:memberid }, function (err,result) {
    done(null, result);
    })
}); 




app.get("/",function(req,res){
    res.render("index.ejs",{login:req.user});
});

app.get("/career",(req,res)=>{
    
    res.render("career.ejs", {login:req.user})
})

app.get("/medical_department",(req,res)=>{
    
    res.render("medical_department.ejs", {login:req.user})
})

//다른 서브페이지들도 로그인되어있는 회원정보 데이터 보내야함
app.get("/board",(req,res)=>{
    res.render("boardlist.ejs",{login:req.user})
})









//회원가입 페이지 화면으로 가기위한 경로요청
app.get("/join",(req,res)=>{
    res.render("join.ejs", {login:req.user});
})

//회원가입 데이터 db에 저장 요청
app.post("/joindb",(req,res)=>{
    // 아이디 -> memberid:아이디입력한거
    // 비밀번호 -> memberpass:비밀번호입력한거

    db.collection("members").findOne({memberid:req.body.memberid},(err,member)=>{
        //찾은 데이터값이 존재할 때 -> 중복된 아이디가 있음
        if(member){
            //자바스크립트 구문을 삽입할 때도 사용가능
            res.send("<script> alert('이미 가입된 아이디입니다'); location.href='/join'; </script>")
        }
        else{
            db.collection("count").findOne({name:"회원"},(err,result)=>{
                db.collection("members").insertOne({
                    memberno:result.memberCount,
                    memberid:req.body.memberid,
                    memberpass:req.body.memberpass
                },(err)=>{
                    db.collection("count").updateOne({name:"회원"},{$inc:{memberCount:1}},(err)=>{
                        res.send("<script>alert('회원가입 완료'); location.href='/login' </script>")
                    })
                })

            });
        }
    })
})


//로그인 화면페이지 경로요청
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})


//로그인 처리 요청경로
app.post("/logincheck",passport.authenticate('local', {failureRedirect : '/login'}),(req,res)=>{
    res.redirect("/"); //로그인 성공시 메인페이지로 이동
})

//로그아웃 처리 요청경로
app.get("/logout",(req,res)=>{
    //로그아웃 함수 적용후 메인페이지로 이동
    //logout 함수는 서버에 있는 세션을 제거해주는 역할
    req.logout(()=>{
        res.redirect("/")
    })
})

//마이페이지 보여주는 경로
app.get("/mypage",(req,res)=>{
    res.render("mypage",{login:req.user})
   // login:req.user
})

//회원정보 수정후 db에 수정요청
app.post("/myupdate",(req,res)=>{
        
    //수정페이지에서 입력한 기존 비밀번호와 로그인하고 있는 중의 비밀번호와 일치하는지 비교
    if(req.body.originPass === req.user.memberpass){
                                                      //로그인하고 있는 유저의 아이디
        db.collection("members").updateOne({memberid:req.user.memberid},
            {$set:{memberpass:req.body.changePass}},(err)=>{ res.redirect("/"); })
    }
    else{
        res.send("<script>alert('기존 비밀번호랑 일치하지 않습니다'); location.href = '/mypage'; </script>")
    }
})


app.get("/board/list",(req,res)=>{

    db.collection("board").find().toArray((err,total)=>{
        //게시글 전체갯수값 알아내기
        let totalData = total.length;
        //웹브라우저 주소창에 몇번 페이징 번호로 접속했는지 체크 page=1 / 
        let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page)
        //게시판에 보여줄 게시글 갯수
        let perPage = 5;
        //블록당 보여줄 페이징번호 갯수
        let blockCount = 5;
        //이전,다음 블록간 이동을 하기위한 현재 페이지 블록을 구해보기
        let blockNum = Math.ceil(pageNumber / blockCount);
        //블록안에 페이지 번호 시작값 알아내기
        let blockStart = ((blockNum - 1) * blockCount) + 1;
        //블록안에 페이지 번호 끝 값 알아내기 1,2,3,4,5에서 5번
        let blockEnd = blockStart + blockCount -1
        
        //게시글 전체 갯수를 토대로 페이지 번호가 몇개가 만드렁져서 표시되야하는지?
        let totalPaging = Math.ceil(totalData / perPage);

        //블록(그룹)에서 마지막 페이지번호가 끝번호보다 크다면 페이지의 끝번호를 강제로 고정
        if(blockEnd > totalPaging){
            blockEnd = totalPaging;  // page=10  -> 끝번호는 7로 고정 (잘못된 페이지 접근을 막으려고)
        }

        //블록(그룹)의 총 갯수값  구하기
        let totalBlock = Math.ceil(totalPaging / blockCount)

        //데이터베이스에서 3개씩 게시글을 뽑아서 가지고 오기위한 순서값을 정해줌
        let startFrom = (pageNumber - 1) * perPage

        //데이터베이스에서  find명령어로 꺼내오는 작업을 진행!
        db.collection("board").find().sort({num:-1}).skip(startFrom).limit(perPage).toArray((err,result)=>{
            res.render("brd_list.ejs",{

                data:result, //find로 찾아온 게시글 데이터들 3개 보내줌
                totalPaging:totalPaging, //페이지 번호 총 갯수값 -> 7개
                blockStart:blockStart, //블록안에 페이지 시작 번호값
                blockEnd:blockEnd,//블록안에 페이지 끝 번호값
                blockNum:blockNum, //보고있는 페이지 번호가 몇번 블록(그룹)에 있는지 확인
                totalBlock:totalBlock, //블록(그룹)의 총 갯수값 -> 2개
                pageNumber:pageNumber, //현재 보고있는 페이지 번호값
                text:"",
                login:req.user
            })
        })
        
    })
  
})


// 게시글 검색 요청
app.get("/search", (req, res) => {
    // 검색 조건 세팅 (찾는 단어 / 검색결과 갯수 몇개인지 / 순서정렬 등)
    let check = [{
        $search: {
            index: "searchIndex", // db사이트에서 설정한 index이름
            text: {
                query: req.query.inputText, // 검색한 단어를 입력한 데이터 값
                path: "title" // 항목 선택
            }
        }
    }, {
        $sort: {
            // 정렬 설정
            num: -1
        }
    },
 
    ];

    db.collection("board").aggregate(check).toArray((err, total) => {
      
         // 게시글 전체 갯수값 알아내기
         let totalData = total.length;
         // 웹브라우저 주소창에 몇번 페이징 번호로 접속했는지 체크
         let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page)
         // 게시판에 보여줄 게시글 갯수
         let perPage = 5;
         // 블록당 보여줄 페이징 번호 갯수
         let blockCount = 5;
         // 이전,다음 블록간 이동을 하기위한 현재 페이지 블록 구해보기
         let blockNum = Math.ceil(pageNumber / blockCount);
         // 블록안에 페이지 번호 시작값 알아내기
         let blockStart = ((blockNum - 1) * blockCount) + 1;
         // 블록안에 페이지 번호 끝값 알아내기
         let blockEnd = blockStart + blockCount - 1;
 
         // 게시글 전체 갯수 토대로 전체페이지 번호가 몇개가 만들어져서 표시되어야하는지
         let totalPaging = Math.ceil(totalData / perPage);
 
         // 블록(그룹)에서 마지막 페이지번호가 끝번호보다 크다면 페이지의 끝번호를 강제로 고정
         if (blockEnd > totalPaging) {
             blockEnd = totalPaging;
         }
 
         // 블록(그룹)의 총 갯수값 구하기
         let totalBlock = Math.ceil(totalPaging / blockCount);
 
         // db에서 3개씩 게시글을 뽑아서 가지고 오기위한 순서값을 정해줌
         let startFrom = (pageNumber - 1) * perPage;


         db.collection("board").aggregate(check).sort({ num: -1 }).skip(startFrom).limit(perPage).toArray((err, result) => {
            res.render("brd_list.ejs", {
                data: result, // 게시글 데이터들 3개 보내줌
                totalPaging: totalPaging, //페이지 번호 총갯수값
                blockStart: blockStart, //블록안에 페이지 시작번호값
                blockEnd: blockEnd, //블록안에 페이지 끝번호값
                blockNum: blockNum, //보고있는 페이지의 블록(그룹)번호
                totalBlock: totalBlock, //블록(그룹)의 총갯수값
                pageNumber: pageNumber, //현재 보고있는 페이지 번호값
                text:req.query.inputText, //검색창에 value값 표시(검색어 표시)
                select:req.query.search,//셀렉트 태그에서 고른 항목값 (카테고리 / 해시태그)
                login: req.user //로그인 정보
            })
        })
    })
})



//게시글 작성화면 페이지
app.get("/board/insert",(req,res)=>{
    res.render("brd_insert.ejs" , {login:req.user});
})


//게시글 데이터베이스에 저장
                
app.post("/dbupload",(req,res)=>{
   
    db.collection("count").findOne({name:"게시글 갯수"},(err,countResult)=>{
        db.collection("board").insertOne({
            num:countResult.prdCount,
            title:req.body.title,
            author:req.body.author,
            content:req.body.content
        },(err,result)=>{
            db.collection("count").updateOne({name:"게시글 갯수"},{$inc:{prdCount:1}},(err,result)=>{
                res.redirect(`/board/detail/${countResult.prdCount}`)
            })
        })
    })
})

//게시글 상세화면페이지
app.get("/board/detail/:num",(req,res)=>{

    db.collection("board").findOne({num:Number(req.params.num)},(err,result)=>{
        res.render("brd_detail.ejs",{data:result});
    })
})


//게시글 수정화면 페이지 요청
app.get("/board/update/:num",(req,res)=>{
    db.collection("board").findOne({num:Number(req.params.num)},(err,result)=>{

        res.render("brd_update.ejs",{data:result});
    })
})


//게시글 데이터베이스에 수정처리
app.post("/dbupdate",(req,res)=>{
    db.collection("board").updateOne({num:Number(req.body.num)},{$set:{title:req.body.title,author:req.body.author,content:req.body.content}},(err,result)=>{
        res.redirect(`/board/detail/${req.body.num}`) 
    })
})




