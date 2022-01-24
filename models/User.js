const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const { enable } = require('express/lib/application');
const saltRounds = 10   // salt가 몇글자 인지
const jwt = require('jsonwebtoken');

//User 도메인 테이블을 생성하기 위한 스키마
const userSchema=mongoose.Schema({
    name:{
        type: String,
        maxlength: 50,
    },
    email:{
        type: String,
        // space bar를 없애준다.
        trim: true,
        // 중복을 허용하지 않는다.
        unique: 1
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname:{
        type:String,
        maxlength:50,
    },
    role:{
        type:Number,
        // 기본값
        default: 0,
    },
    image: String,
    token:{
        type:String,
    },
    tokenExp:{
        type: Number,
    }
});

userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        // salt를 이용하여 비밀번호를 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            // myPlaintextPassword : 암호화 되지 않은 순수한 비밀번호 (uwer.password)
            // hash : 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
}) 


userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword 1234567  암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken') //user._id : 몽고디비에나오는 유저 아이디
    // user._id + 'secretToken' = token
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    user._id + '' = token

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


// User를 model화 해준다.
const User=mongoose.model('User', userSchema);

// 다른 파일에서도 이 모델을 쓸 수 있도록 함.
module.exports={ User }