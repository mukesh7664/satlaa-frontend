import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../utils/fetchData';

const useInitializeStore = (initialData) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      fetchData(dispatch, initialData); // Pass initial data to fetchData
    }
  }, [dispatch, initialData]);
};

export default useInitializeStore;
