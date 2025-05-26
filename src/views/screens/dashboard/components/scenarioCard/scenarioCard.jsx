
import { Button, Card, Checkbox, Divider, Popconfirm, Segmented, Tooltip, Typography } from 'antd';
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { toTitleCase, readExcelToArray, writeArrayToExcel, scenarioScreensToRefArray, checkExcelValidity } from "src/utils";
import { notify } from 'src/notify';

import './scenarioCard.scss';

const { Text } = Typography;

const ScenarioCard = ({ scenario, scenariosValues, selected, handleValueChange, handleClick, handleDelete, handleExcelUpload, handleEdit }) => {
  const onExcelDownload = (e) => {
    e.stopPropagation();

    let scenarioRefArray = scenarioScreensToRefArray(JSON.parse(scenario.jsonMetaData));

    if (scenario.dataExcel) {
      const excelData = JSON.parse(scenario.dataExcel);

      scenarioRefArray = scenarioRefArray.map((row, i) => {
        if (i === 0) return row; // Skip header row


        const [id, screen, fieldName] = row;
        const [_, ...values] = excelData[i - 1];

        return [id, screen, fieldName, ...values];
      });
    }

    writeArrayToExcel(scenarioRefArray, `${toTitleCase(scenario.name)} Scenario values.xlsx`);
  };

  const onExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      notify.error('No file selected.');
      return;
    }

    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      notify.error('Invalid file type. Please upload an Excel file.');
      return;
    }

    readExcelToArray(file, (excelData) => {
      e.target.value = null; // Clear the input value
      const scenarioRefArray = scenarioScreensToRefArray(JSON.parse(scenario.jsonMetaData));

      let canProcess = checkExcelValidity(excelData, scenarioRefArray);

      if (canProcess) {
        const excelDataCopy = excelData.map(([id, , , ...values], i) => { // Extract id, screen (ignore), fieldName (ignore) and values
          if (i === 0) return; // Skip header row

          return [id, ...values];
        }).filter(row => row); // Remove undefined rows

        handleExcelUpload(JSON.stringify(excelDataCopy));
      }
    });
  };

  return (
    <Card
      className='scenario-card'
      size='small'
      title={toTitleCase(scenario.name)}
      extra={<Checkbox checked={selected} />}
      actions={[(
        <span onClick={e => e.stopPropagation()}>
          <Popconfirm
            title='Delete Scenario'
            description={`Are you sure to delete ${scenario.name}?`}
            onConfirm={handleDelete}
            okText='Yes'
            cancelText='No'
          >
            <Button
              icon={<DeleteOutlined />}
              size='small'
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </span>
      ), (
        <Button
          type='primary'
          icon={<EditOutlined />}
          size='small'
          onClick={e => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          Edit Values
        </Button>
      )]}
      onClick={handleClick}
      hoverable
    >
      <div className='scenario-card-body d-flex flex-column gap-1'>
        <div className='d-flex justify-content-between align-items-center'>
          <Text><b>{JSON.parse(scenario.jsonMetaData)?.length}</b> screen(s)</Text>
          <Text>{new Date(scenario.createdAt).toLocaleString()}</Text>
        </div>

        <Divider className='my-0' />

        <div className='d-flex gap-2 align-items-center justify-content-between'>
          <Text className='text-nowrap'>Execute with</Text>
          <span onClick={e => e.stopPropagation()}>
            <Tooltip
              title={!scenario.dataExcel ? 'Excel values not available yet. Please upload to use this feature.' : ''}
              color='red'
            >
              <Segmented
                options={[
                  { label: 'Manual', value: 'manual', icon: <EditOutlined /> },
                  { label: 'Excel', value: 'excel', icon: <FileExcelOutlined /> },
                ]}
                onClick={e => e.stopPropagation()}
                disabled={!scenario.dataExcel}
                value={scenariosValues[scenario.id] || 'manual'}
                onChange={value => handleValueChange(value)}
              />
            </Tooltip>
          </span>
        </div>

        <Divider className='my-0' />

        <div className='d-flex gap-2 align-items-center justify-content-between'>
          <Text className='text-nowrap'>Excel values</Text>
          <div className='d-flex gap-1'>
            <Button
              icon={<DownloadOutlined />}
              size='small'
              onClick={onExcelDownload}
            >
              Download
            </Button>
            <Button
              icon={<UploadOutlined />}
              size='small'
              onClick={e => {
                e.stopPropagation();
                document.getElementById(`${scenario.id}excelFileUpload`).click();
              }}
            >
              Upload
            </Button>
            <input
              type='file'
              id={`${scenario.id}excelFileUpload`}
              style={{ display: 'none' }}
              onClick={e => e.stopPropagation()}
              onChange={onExcelUpload}
            />
          </div>
        </div>
      </div>
    </Card>
  )
};

export default ScenarioCard;
