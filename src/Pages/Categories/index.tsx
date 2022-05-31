/** Categoreis.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Page that allows the creation and edit of categories
 */

// Components
import { useEffect, useState } from 'react';
import Page from '../../Components/Page';

const Categories = (): JSX.Element => {
  // Hooks
  const [loaded, setLoaded] = useState(false);

  // Main API call
  useEffect(() => {
    setLoaded(true);
  }, []);

  const header = (
    <div className="">
      <div>
        <h1>Categories</h1>
      </div>
    </div>
  );

  return (
    <Page loading={!loaded} selected="Categories" header={header}>
      <div>TODO</div>
    </Page>
  );
};

export default Categories;
