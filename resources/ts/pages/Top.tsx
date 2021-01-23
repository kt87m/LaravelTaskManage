import React from 'react';
import { FaArrowDown, FaArrowUp, FaFilter } from 'react-icons/fa';
import { MdSort } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import TaskList from '../components/TaskList';
import { Checkbox } from '../components/Checkbox';

const Top: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const filter = (/done=[^&]+/.exec(location.search) ?? [''])[0];
  const [, direction, sort = ''] =
    /^([+-]?)([^,]+)/.exec(searchParams.get('sort') || '') ?? [];
  const sortByDesc = direction === '-';

  const onChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const [key, value] = e.target.value.split('=');
      searchParams.set(key, value);
    } else searchParams.delete('done');

    history.replace({
      search: searchParams.toString(),
    });
  };

  const onChangeSort = (sort: string, sortByDesc: boolean) => {
    if (sort) {
      searchParams.set('sort', `${sortByDesc ? '-' : ''}${sort}`);
    } else if (sortByDesc) {
      searchParams.set('sort', `-created_at`);
    } else searchParams.delete('sort');

    history.replace({
      search: searchParams.toString(),
    });
  };

  return (
    <div className="relative">
      <h2 className="text-xl md:text-2xl mb-3 text-gray-500">タスク一覧</h2>

      <div className="flex absolute top-0 right-0">
        <label className="flex items-center">
          <FaFilter
            title="フィルター"
            className="inline align-middle text-lg sm:text-xl text-gray-500"
          />
          <select
            data-testid="filter"
            value={filter}
            onChange={onChangeFilter}
            className="appearance-none ml-1 p-1 text-base outline-none border-b-2 border-gray-500 focus:border-0 focus:border-blue-300 rounded-none"
          >
            <option value="">全て</option>
            <option value="done=true">完了済み</option>
            <option value="done=false">未完了</option>
          </select>
        </label>
        <label className="flex items-center ml-6">
          <MdSort
            title="ソート"
            className="inline align-middle text-2xl sm:text-3xl text-gray-500"
          />
          <select
            data-testid="sort"
            value={sort}
            onChange={(e) => onChangeSort(e.target.value, sortByDesc)}
            className="appearance-none p-1 text-base outline-none border-b-2 border-gray-500 focus:border-0 focus:border-blue-300 rounded-none"
          >
            <option value="">作成日時</option>
            <option value="updated_at">更新日時</option>
          </select>
        </label>
        <Checkbox
          data-testid="desc"
          checked={sortByDesc}
          title={sortByDesc ? '降順' : '昇順'}
          onChange={() => {
            onChangeSort(sort, !sortByDesc);
          }}
          className="bg-gray-500 border-gray-500 hover:bg-blue-300 hover:border-transparent focus:bg-blue-300 focus:border-transparent focus-checked:bg-blue-300"
          uncheckedicon={FaArrowUp}
          checkedicon={FaArrowDown}
        />
      </div>

      <TaskList />
    </div>
  );
};

export default Top;
