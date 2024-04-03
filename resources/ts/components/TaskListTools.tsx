import React from 'react';
import { FaArrowDown, FaArrowUp, FaFilter } from 'react-icons/fa';
import { MdSort } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';

const TaskListTools: React.FC = () => {
  const navigate = useNavigate();
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

    navigate({
      search: searchParams.toString(),
    }, { replace: true });
  };

  const onChangeSort = (sort: string, sortByDesc: boolean) => {
    if (sort) {
      searchParams.set('sort', `${sortByDesc ? '-' : ''}${sort}`);
    } else if (sortByDesc) {
      searchParams.set('sort', `-created_at`);
    } else searchParams.delete('sort');

    navigate({
      search: searchParams.toString(),
    }, { replace: true });
  };

  return (
    <div className="flex absolute top-0 right-0 transform md:transform-none origin-top-right scale-75">
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
          <option value="done=1">完了済み</option>
          <option value="done=0">未完了</option>
        </select>
      </label>
      <label className="flex items-center ml-3 md:ml-6">
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
          <option value="priority">優先度</option>
          <option value="duedate">締め切り</option>
        </select>
      </label>
      <Checkbox
        data-testid="desc"
        checked={sortByDesc}
        title={sortByDesc ? '降順' : '昇順'}
        onChange={() => {
          onChangeSort(sort, !sortByDesc);
        }}
        className="!bg-gray-500 border-gray-500 !hover:bg-blue-300 hover:border-transparent !focus:bg-blue-300 focus:border-transparent !focus-checked:bg-blue-300"
        wrapperClassName="mx-3 md:mx-0 self-center transform md:transform-none scale-125"
        uncheckedicon={FaArrowUp}
        checkedicon={FaArrowDown}
      />
    </div>
  );
};

export default TaskListTools;
