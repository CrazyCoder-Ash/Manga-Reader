const express= require('express');

const router = express.Router();
const axios=require('axios')
const Bookmark=require('../models/bookmarks')
const mongoose=require('mongoose'); 
const ObjectId = mongoose.Types.ObjectId;

router.get('/manga/:id',async(req,res)=>{
  const id=req.params.id
  try{
    const chapfeed=await axios.get(`https://api.mangadex.org/manga/${id}/feed`,{
      params:{
        translatedLanguage:["en"],
        'order[chapter]':"asc",
      }
    })
    const resChapfeed=chapfeed.data.data;
    const englishChap=resChapfeed.map(chap=>{return {
            number:chap.attributes.chapter,
            id:chap.id
    }})
    res.send({totalchapter:englishChap.length,chapter:englishChap})
  }catch(err){
      res.status(500).send(err)
  }
})

router.get('/bookmarks',async( req , res )=>{
      const user=req.session.userId
       if (!user) {
    return res.status(401).json({ error: 'User not logged in' });
  }
        const userObjectId = new ObjectId(user);

      try{
           const results = await Bookmark.find({ user: userObjectId});
           if (results.length === 0) {
  return res.status(200).json({ bookmarks: [] });
}
      
      const mangaIds=results.map((result)=> result.mangaid);
      
      const fetchMangaDetails = mangaIds.map(async (id) => {
        try{
      const response = await fetch(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`);
      const { data } = await response.json();

      const { attributes, relationships = [] } = data;
      const title = attributes.title.en || Object.values(attributes.title)[0] || 'Unknown Title';
      const genre = attributes.tags
        .filter((tag) => tag.attributes.group === 'genre')
        .map((tag) => tag.attributes.name.en);
      const coverRel = relationships.find((rel) => rel.type === 'cover_art');
      const fileName = coverRel?.attributes?.fileName;

      return {
        id: data.id,
        title,
        status: attributes.status,
        year: attributes.year,
        lastChapter: attributes.lastChapter,
        contentRating: attributes.contentRating,
        updatedAt: attributes.updatedAt,
        genre,
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${data.id}/${fileName}`
          : null,
      };
    }
  catch (err) {
        console.error(`Error fetching manga with ID ${id}:`, err.message);
        return null; // Optional: skip failed ones
      }
  }
  );


    const mangaList = await Promise.all(fetchMangaDetails);
        const validManga = mangaList.filter((manga) => manga !== null);

    res.status(200).json({ bookmarks: validManga });
        }catch(error){
console.error('Server error while fetching bookmarks:', error);
    res.status(500).json({ error: 'Server error while fetching bookmarks' });      }
})

router.get('/checkBookmark',async(req, res)=>{
          const user=req.session.userId
            if (!user) {
    return res.status(401).json({ error: 'User not logged in' });
  }
        const id=req.query.id
        const userObjectId = new ObjectId(user);
    try {
            const exists = await Bookmark.exists({ user: userObjectId, mangaid: id });
             res.json(Boolean(exists)); // true or false
  }
  catch (error) {
        console.log(error )
    }

})







router.get('/:id', async(req,res)=>{
  const id=req.params.id
  try{
        const chapPageId=await axios.get(`https://api.mangadex.org/at-home/server/${id}`)
        const baseUrl = chapPageId.data.baseUrl;
        const { hash, data } = chapPageId.data.chapter;
        const imageURLs=data.map(chap=>`${baseUrl}/data/${hash}/${chap}`);
        res.send(imageURLs)
  }catch(err){
      res.status(500).send('err bro')
  }
})

router.post('/addbookmark',async (req, res)=>{
  const id=req.body.id
  const userId = req.session.userId;
    if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try{
    const newBookmark = new Bookmark(
      {
      user: userId,
      mangaid: id
    });
    await newBookmark.save();
    res.status(201).json(newBookmark);
  }catch(err){
          res.status(500).send('err bookmark')
  }
})
router.post('/removebookmark',async (req, res)=>{
  const id=req.body.id
  const userId = req.session.userId;
  const userObjectId = new ObjectId(userId);

    if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try{
    const result = await Bookmark.deleteOne({ user: userObjectId,mangaid:id});

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.status(200).json({ message: 'Bookmark removed successfully' });
  }catch(err){
          res.status(500).send('err bookmark')
  }
})

module.exports=router;