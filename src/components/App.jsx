import { useState, useEffect, useCallback } from 'react';
import { AppWrap } from './App.styled';
import { fetchImages } from './services/fetch';
import { Loader } from './Loader/Loader';
import LoadMoreBtn from './Button/Button';
import Searchbar from './searchbar/searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

function App() {
  const [searchText, setSearchText] = useState('');
  const [images, setImages] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState(false);

  const createSearchText = useCallback(searchText => {
    setSearchText(searchText);
    setPage(1);
  }, []);

  const incrementPage = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    if (searchText) {
      setIsLoading(true);
      setPage(1);
      fetchImages(searchText, page)
        .then(data => {
          setImages(data.hits);
          setIsLoading(false);
          setIsHidden(true);
          setTotalHits(data.totalHits);
          setError(false);
        })
        .catch(error => setError(true));
    }
  }, [searchText, page]);

  useEffect(() => {
    if (page > 1) {
      setIsLoading(true);
      fetchImages(searchText, page)
        .then(({ hits }) => {
          setImages(prevImages => [...prevImages, ...hits]);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    }
  }, [page, searchText]);

  return (
    <AppWrap>
      <Searchbar createSearchText={createSearchText} />
      {error && <h1>Please try again</h1>}
      {images && <ImageGallery images={images} />}
      {totalHits > 12 && !isLoading && isHidden && (
        <LoadMoreBtn onClick={incrementPage} isLoading={isLoading} />
      )}
      {isLoading && <Loader widthLoader={'200'} heightLoader={'200'} />}
    </AppWrap>
  );
}
// 00
export default App;