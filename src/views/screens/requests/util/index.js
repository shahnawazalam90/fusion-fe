export const requestModalMode = {
  create: 'create',
  update: 'update',
  view: 'view',
};

export const requestMethodOptions = [{
  value: 'get',
  label: 'GET',
}, {
  value: 'post',
  label: 'POST',
}, {
  value: 'put',
  label: 'PUT',
}, {
  value: 'delete',
  label: 'DELETE',
}];

export const requestTypeOptions = [{
  value: 'polling',
  label: 'Polling',
}, {
  value: 'stateless',
  label: 'Stateless',
}];

export const requestModalInitialValues = {
  name: '',
  method: requestMethodOptions[0].value,
  url: '',
  headers: '',
  type: requestTypeOptions[0].value,
  pollingInterval: 0,
  pollingTimeout: 0,
  expectedStatus: 200,
  expectedResponse: '',
  payload: '',
  error: '',
};
