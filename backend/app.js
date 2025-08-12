const express = require('express');
const axios = require('axios');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const crypto=require('crypto')
const { title } = require('process');
const cors=require('cors');
const session = require('express-session');
const User=require('./models/users')
const mongoose= require('mongoose')
const MongoDBStore=require('connect-mongodb-session')(session)
const ChapterRouter = require('./routes/chapter')
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY= process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

const app=express();
const store=new MongoDBStore({
  uri:'mongodb://localhost:27017/manga-app',
  collection:'sessions'
});

app.use(cors({
  origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(
  session({ 
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false,       // false for HTTP (localhost), true for HTTPS in prod
      httpOnly: true,
      sameSite: 'lax'      // 'lax' works well for fetch with credentials: 'include'
    }
  })
);


const baseUrl = 'https://api.mangadex.org';
const excludedTagNames = ['Harem'];
//const includedTagNames = ['Harem'];

const order = {
    rating: 'desc',
    followedCount: 'desc'
};
const finalOrderQuery = {};

// { "order[rating]": "desc", "order[followedCount]": "desc" }
for (const [key, value] of Object.entries(order)) {
    finalOrderQuery[`order[${key}]`] = value;
}
;

let excludedTagIDs=[];
let includedTagIDs=[];

const fetchExcludedTagIDs = async () => {
  try {
    const tags = await axios.get(`${baseUrl}/manga/tag`);
    // includedTagIDs = tags.data.data
    // .filter(tag => includedTagNames.includes(tag.attributes.name.en))
    // .map(tag => tag.id);
    excludedTagIDs = tags.data.data
      .filter(tag => excludedTagNames.includes(tag.attributes.name.en))
      .map(tag => tag.id);
    console.log('Excluded tag IDs:', excludedTagIDs);
  } catch (error) {
    console.error('Failed to fetch excluded tag IDs:', error.message);
  }
};
fetchExcludedTagIDs();

// GET /api/session-check
app.get('/api/check-session', (req, res) => {
  res.json({ isLoggedIn: !!req.session.isLoggedIn });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
});
app.post('/signup',async(req,res)=>{
    const input=req.body;
    try{
      const existing=await User.findOne({ email: input.email });
      if(existing){
       return res
        .status(409) // Conflict
        .json({ message: 'User already exists. Try logging in.' });
      }
      const hashedPassword = await bcrypt.hash(input.password, 12);
       const user = new User({
      ...input,
      password: hashedPassword,
    });    
      await user.save()
      res.status(201).send(user)
    }catch(error){
            console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
    }
  )

app.post('/login',async(req,res)=>{
    const {email, password}=req.body;
     try{
          const user=await User.findOne({email});
          if(!user){
           return res
        .status(409) // Conflict
        .json({ message: 'No User Found' });
          }
          const isMatch = await bcrypt.compare(password, user.password);
           if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password.' });
    }
          req.session.isLoggedIn = true;
          req.session.userId = user._id;
          

const msg = {
  to: email,
  from: 'nithyamugunthan686@gmail.com',
  subject: 'Test email',
  text: 'This is a test email.',
  html: '<strong>This is a test email.</strong>',
};

sgMail
  .send(msg)
  .then(() => console.log('Email sent'))
  .catch((error) => console.error('Email error:', error));
      res.status(201).send({ message: 'Logged in successfully' });
        }
      catch(error){
             console.error(error);
             return res.status(500).json({ message: 'Server error' })}
            
            })


app.post('/changePassword', (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        const msg={to: req.body.email,
          from: 'nithyamugunthan686@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `}
          sgMail
  .send(msg)
  .then(() => console.log('Email sent'))
  .catch((error) => console.error('Email error:', error));
          
      })
      .catch(err => {
        console.log(err);
      });
  })
})
app.post('/changePassword/:token', async (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.password;

  // ✅ Check if password is missing
  if (!newPassword || newPassword.trim() === '') {
    return res.status(400).json({ message: 'Password is required.' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.redirect('/login'); // or send a JSON response
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



app.get('/mangadetails',async(req,res)=>{
try{
  const id=req.query.id;
  if (!id) return res.status(400).json({ error: 'Missing manga ID' });
  const resp=await axios.get(`${baseUrl}/manga/${id}`,{
    params:{
      includes:['cover_art']
    }
  })
        const cdata=resp.data;
        const relationship=cdata.data.relationships;
        const coverart=relationship.find(rel => rel.type==='cover_art')      
        const fileName = coverart?.attributes?.fileName; 
        const coverpic= fileName ? `https://uploads.mangadex.org/covers/${id}/${fileName}`: null;
        const statsResp = await axios.get(`${baseUrl}/statistics/manga/${id}`);
        const statsData = statsResp.data.statistics[id];
        const views={
           follows: statsData?.follows ?? 0,
          averageRating: statsData?.rating?.average ? Number(statsData.rating.average).toFixed(1) : null
        }
        res.json({resp:cdata,coverpic,views});



}catch(error){
console.log('error in fetching manga data')
}
}
)
app.get('/rating', async (req, res) => {
  try {
    const resp = await axios.get(`${baseUrl}/manga`, {
      params: {
        limit: 50,
        includes: ['cover_art'],
        'excludedTags': excludedTagIDs,
                ...finalOrderQuery
      }
    });

    const mangaArray = resp.data.data;
    const ids = mangaArray.map(manga => manga.id);

    // Batch size: 10 to avoid overload
    const batchSize = 10;
    const batchedStats = {};

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const statsResp = await axios.get(`${baseUrl}/statistics/manga`, {
        params: { manga: batch }
        
      });
      Object.assign(batchedStats, statsResp.data.statistics);
    }

    const result = mangaArray.map(manga => {
      const id = manga.id;
      const attributes = manga.attributes;
      const title = attributes.title.en || Object.values(attributes.title)[0] || "Unknown Title";
      const stats = batchedStats[id] || {};
      const relationships = manga.relationships || [];

      const coverArtRel = relationships.find(rel => rel.type === 'cover_art');
      const fileName = coverArtRel?.attributes?.fileName;

      return {
        id,
        title,
        follows: stats.follows ?? 0,
        averageRating: stats.rating?.average ?? null,
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${id}/${fileName}`
          : null
      };
    });

    const sorted = result.sort((a, b) => (b.follows ?? 0) - (a.follows ?? 0));
    res.json(sorted);
  } catch (error) {
    console.error('Error fetching rating manga:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/latest',async(req,res)=>{
  try{
    const resp=await axios.get(`${baseUrl}/manga`,{
      params:{
        limit:50,
        includes:['cover_art']
      }
    })
    const mangaArray=resp.data.data;
    const ids=mangaArray.map(m=>m.id).join(',');


     const result = mangaArray.map(manga => {
      const id = manga.id;
      const attributes = manga.attributes;
      const status=manga.attributes.status;
      const year=manga.attributes.year;
      const contentRating=manga.attributes.contentRating;
      const tags=manga.attributes.tags;
      const title = attributes.title.en;
      const relationships = manga.relationships || [];
      const updatedAt=attributes.updatedAt;
      const coverArtRel = relationships.find(rel => rel.type === 'cover_art');
      const fileName = coverArtRel?.attributes?.fileName;
      const lastChapter=manga.attributes?.lastChapter;
      const genre=tags.map((tag)=>(
            tag.attributes.group==="genre" ? tag.attributes?.name?.en : null
      )).filter((genre)=>{
        return genre!==null
      })
      return {
        id,
        title,
        status,
        genre,
        year,
        lastChapter,
        contentRating,
        tags,
        updatedAt,
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${id}/${fileName}`
          : null
      };
       });
   const sorted = result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(sorted.slice(0, 20));
    
  }catch(error){
    console.error('error');
    res.status(500).json({ error: 'Failed to fetch cover art' });
  }
})
app.get('/ongoing',async(req,res)=>{
  try{
    const resp=await axios.get(`${baseUrl}/manga`,{
      params:{
        limit:50,
        includes:['cover_art']

      }
    })
    const mangaArray=resp.data.data;
    const ids = mangaArray.filter((m) => m.attributes.status === "ongoing");
    

     const result = ids.map(manga => {
      
      const id = manga.id;
      const attributes = manga.attributes;
      const status=manga.attributes.status;
      const year=manga.attributes.year;
      const contentRating=manga.attributes.contentRating;
      const tags=manga.attributes.tags;
      const title = attributes.title.en || Object.values(attributes.title)[0] || "Unknown Title";
      const relationships = manga.relationships || [];
      const updatedAt=attributes.updatedAt;
      const coverArtRel = relationships.find(rel => rel.type === 'cover_art');
      const fileName = coverArtRel?.attributes?.fileName;
            const lastChapter=manga.attributes?.lastChapter;

      const genre=tags.map((tag)=>(
            tag.attributes.group==="genre" ? tag.attributes?.name?.en : null
      )).filter((genre)=>{
        return genre!==null
      })
      return {
        id,
        status,
        genre,
        year,
        lastChapter,
        contentRating, 
        title,
        updatedAt,
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${id}/${fileName}`
          : null
      };
       });
   const sorted = result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(sorted.slice(0, 20));
    
  }catch(error){
    console.error('error');
    res.status(500).json({ error: 'Failed to fetch cover art' });
  }
})
app.get('/completed',async(req,res)=>{
  try{
    const resp=await axios.get(`${baseUrl}/manga`,{
      params:{
        limit:50,
        includes:['cover_art']

      }
    })
    const mangaArray=resp.data.data;
    const ids = mangaArray.filter((m) => m.attributes.status === "completed");
    

     const result = ids.map(manga => {
      
      const id = manga.id;
      const attributes = manga.attributes;
      const status=manga.attributes.status;
      const year=manga.attributes.year;
      const contentRating=manga.attributes.contentRating;
      const tags=manga.attributes.tags;
      const title = attributes.title.en || Object.values(attributes.title)[0] || "Unknown Title";
      const relationships = manga.relationships || [];
      const updatedAt=attributes.updatedAt;
      const coverArtRel = relationships.find(rel => rel.type === 'cover_art');
      const fileName = coverArtRel?.attributes?.fileName;
            const lastChapter=manga.attributes?.lastChapter;

      const genre=tags.map((tag)=>(
            tag.attributes.group==="genre" ? tag.attributes?.name?.en : null
      )).filter((genre)=>{
        return genre!==null
      })
      return {
        id,
        status,
        genre,
        year,
        lastChapter,
        contentRating, 
        title,
        updatedAt,
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${id}/${fileName}`
          : null
      };
       });
   const sorted = result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(sorted.slice(0, 20));
    
  }catch(error){
    console.error('error');
    res.status(500).json({ error: 'Failed to fetch cover art' });
  }
})

app.post('/manga',async(req,res)=>{
    const title=req.body.title;

  try {
    const response=await axios({
    method: 'GET',
    url: `${baseUrl}/manga`,
    params: {
        title: title,
        limit:10
    }
});
    const results = response.data?.data || [];
    const mangas = results.map((manga) => {
      const { id ,attributes} = manga;
      const enTitle = attributes?.title?.en || 'No English Title';
      return {
        id,
        title: enTitle
      };
    });

        res.json({ name:mangas });

  } catch (error) {
        res.status(500).json({ error: 'Failed to title' });

  }
})
app.get('/api/check-session',async(req, res)=>{
         res.json({ loggedIn: !!req.session.isLoggedIn });

})

// chapters fetch ,split the codes afterwards maybe by routes starting by /chapter


app.use('/chapter',ChapterRouter);

mongoose.connect('mongodb://localhost:27017/manga-app').then(()=>{
   app.listen(5000, () => {
   console.log('Server running on http://localhost:5000');
  });
}).catch(()=>{
  console.log('cant connect to db')
})



