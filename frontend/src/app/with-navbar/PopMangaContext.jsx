'use client';
import { createContext, useContext } from 'react';

export const PopMangaContext = createContext([]);

export const usePopManga = () => useContext(PopMangaContext);
