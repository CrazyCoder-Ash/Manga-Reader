'use client';
import { useSearchParams } from 'next/navigation';
import Mangadetails from './MangaDetails/Mangadetails';
import Navbar from '../NavBar/Navbar';

const Mangainfo = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return <div><Navbar/>
  <Mangadetails id={id} key={id}/></div>;
};

export default Mangainfo;
