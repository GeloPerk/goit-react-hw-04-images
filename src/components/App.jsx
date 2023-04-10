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
      fetchImages(searchText, 1)
        .then(data => {
          setImages(data.hits);
          setTotalHits(data.totalHits);
          setIsHidden(data.totalHits <= 12);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    }
  }, [searchText]);

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
  }, [page]);

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
// 0
export default App;