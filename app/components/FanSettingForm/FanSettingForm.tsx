import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from '../FormGenerator/FormGenerator';
import { IFormInputField } from '../DashboardForms/DashboardForms';
import fetchJson from '../../lib/fetchJson';
import fetcher from '../../lib/fetcher';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import { IUpdateFanProfileRequest } from '../../lib/userSettings/updateFanProfile';
import { IUpdatePageInfoResponse } from '../../lib/userSettings/updatePageInfo';
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
  const { enqueueSnackbar } = useSnackbar();
  const handleOnSubmitFan = async (data) => {
    setSubLoading(true);
    data['userId'] = userId;
    const body = {
      ...data,
    } as IUpdateFanProfileRequest;

    const resData = await fetcher<
      IUpdateFanProfileRequest,
      IUpdatePageInfoResponse
    >('/api/updateFanProfile', body);
    enqueueSnackbar({ message: resData.message });
    setSubLoading(false);
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
      isDisabled={false}
    />
  );
};

export default FanSettingForm;
