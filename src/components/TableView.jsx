import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import styled from 'styled-components'


const TableView = ({ data }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys)[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: '4px' }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
		{
      width: '5%',
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      ...getColumnSearchProps('key'),
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortDirections: ['descend', 'ascend'],
    },
		{
      width: '5%',
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      ...getColumnSearchProps('score'),
    },
    {
      width: '5%',
      title: 'Odds Line',
      dataIndex: 'bet365OddsHandicap',
      key: 'bet365OddsHandicap',
      ...getColumnSearchProps('bet365OddsHandicap'),
    },
		{
      title: 'Home Name',
      dataIndex: 'homeName',
      key: 'homeName',
      width: '10%',
      ...getColumnSearchProps('homeName'),
    },
    {
      title: 'Away Name',
      dataIndex: 'awayName',
      key: 'awayName',
      width: '10%',
      ...getColumnSearchProps('awayName'),
    },
		{
      width: '5%',
      title: 'Quarter',
      dataIndex: 'quarter',
      key: 'quarter',
      ...getColumnSearchProps('quarter'),
    },
		{
      width: '5%',
      title: 'quarter time left',
      dataIndex: 'timerString',
      key: 'timerString',
      ...getColumnSearchProps('timerString'),
    },
		{
      width: '7%',
      title: 'Fouls Home',
      dataIndex: 'foulsHome',
      key: 'foulsHome',
      ...getColumnSearchProps('foulsHome'),
      render: (text) => <span style={{display: 'flex'}}>{text} {parseInt(text) >= 4 ? <Tag style={{fontSize: '0.7rem', marginLeft: '3px'}} color={'red'}>BONUS</Tag> : ''}</span>,
    },
		{
      width: '5%',
      title: 'Fouls Away',
      dataIndex: 'foulsAway',
      key: 'foulsAway',
      ...getColumnSearchProps('foulsAway'),
      render: (text) => <span style={{display: 'flex'}}>{text} {parseInt(text) >= 4 ? <Tag style={{fontSize: '0.7rem', marginLeft: '3px'}} color={'red'}>BONUS</Tag> : ''}</span>,
    },
    {
      width: '5%',
      title: 'freeThrowsRateHome',
      dataIndex: 'freeThrowsRateHome',
      key: 'freeThrowsRateHome',
      ...getColumnSearchProps('freeThrowsRateHome'),
    },
		{
      width: '5%',
      title: 'freeThrowsRateAway',
      dataIndex: 'freeThrowsRateAway',
      key: 'freeThrowsRateAway',
      ...getColumnSearchProps('freeThrowsRateAway'),
    },
		{
      width: '5%',
      title: '2 Points Home',
      dataIndex: 'points2Home',
      key: 'points2Home',
      ...getColumnSearchProps('points2Home'),
    },
		{
      width: '5%',
      title: '2 Points Away',
      dataIndex: 'points2Away',
      key: 'points2Away',
      ...getColumnSearchProps('points2Away'),
    },
		{
      width: '5%',
      title: '3 Points Home',
      dataIndex: 'points3Home',
      key: 'points3Home',
      ...getColumnSearchProps('points3Home'),
    },
		{
      width: '5%',
      title: '3 Points Away',
      dataIndex: 'points3Away',
      key: 'points3Away',
      ...getColumnSearchProps('points3Away'),
    },
		{
      width: '5%',
      title: 'Free Throws Home',
      dataIndex: 'freeThrowsHome',
      key: 'freeThrowsHome',
      ...getColumnSearchProps('freeThrowsHome'),
    },
		{
      width: '5%',
      title: 'Free Throws Away',
      dataIndex: 'freeThrowsAway',
      key: 'freeThrowsAway',
      ...getColumnSearchProps('freeThrowsAway'),
    },
		{
      width: '5%',
      title: 'timeoutsHome',
      dataIndex: 'timeoutsHome',
      key: 'timeoutsHome',
      ...getColumnSearchProps('timeoutsHome'),
    }, 
		{
      width: '5%',
      title: 'timeoutsAway',
      dataIndex: 'timeoutsAway',
      key: 'timeoutsAway',
      ...getColumnSearchProps('timeoutsAway'),
    },
  ];

  return <TableStyled columns={columns} dataSource={data} />;
};

export default TableView

const TableStyled = styled(Table)`
  tbody {
    tr:nth-child(2n) {
      background-color: silver;
      &:hover {
      }
    }
  }
`