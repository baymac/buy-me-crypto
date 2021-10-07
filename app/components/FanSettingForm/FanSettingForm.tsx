import Form from '../FormGenerator/FormGenerator';
import { useState } from 'react';
import { IFormInputField } from '../DashboardForms/DashboardForms';
import { useForm } from 'react-hook-form';
import fetchJson from '../../lib/fetchJson';

const fanUserNameList: IFormInputField[] = [
  {
    label: 'Username',
    isRequired: true,
    type: 'text',
    registerName: 'username',
    isInput: true,
  },
];

const FanSettingForm = ({ initialData, userId }) => {
  const [subLoading, setSubLoading] = useState<boolean>(false);

  const handleOnSubmitFan = async (data) => {
    setSubLoading(true);
    data['userId'] = userId;

    const resData = await fetchJson('/api/updateFanProfile', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resData.error) {
      setSubLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <Form
      formInfo={fanUserNameList}
      handleOnSubmit={handleOnSubmitFan}
      handleSubmit={handleSubmit}
      register={register}
      errors={errors}
      submitBtnText={'Save'}
      initialData={initialData}
      setValue={setValue}
      subLoading={subLoading}
    />
  );
};

export default FanSettingForm;
