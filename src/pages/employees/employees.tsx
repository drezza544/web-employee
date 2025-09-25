import './employees.scss';
import { useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';

import Appbar from '../../components/Appbar/Appbar';
import Card from '../../components/Card/Card';
import Colors from '../../assets/Colors/Colors';

/**
 * IMPORT DEVEXPRESS FOR DESIGN TOOLS
 */
import DataGrid, { Column, EmailRule, FilterRow, Pager, Paging, RequiredRule, SearchPanel, Selection } from 'devextreme-react/data-grid';
import FormDrawer from '../../components/Drawer/DrawerRight/DrawerRight';
import TextInputDefault from '../../components/TextInput/TextinputDefault';
import BasicButton from '../../components/Button/BasicButton';
import { ValidationGroup, Validator } from 'devextreme-react';
import Loading from '../../components/Loading/Loading';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import type { LoadOptions } from 'devextreme/data';

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
}

const Employees = () => {
    let baseUrl = import.meta.env.VITE_API_URL;

    const validationField = useRef<null | any>(null);

    const [ drawerCreateVisible, setDrawerCreateVisible ] = useState(false);
    const [ drawerUpdateVisible, setDrawerUpdateVisible ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const [ listEmployee, setListEmployee ] = useState<DataSource | null>(null);
    const [ dataEmployee, setDataEmployee ] = useState<Employee | null>(null);
    const [ selectedEmployee, setSelectedEmployee ] = useState<Employee[]>([]);

    /**
     * STATE INPUT TYPE
     */
    const [ name, setName ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ position, setPosition ] = useState<string>('');

    /**
     * Function Clear Data Input
     */
    const resetForm = () => {
        setDataEmployee(null);
        setName('');
        setEmail('');
        setPosition('');
        setSelectedEmployee([]);
    }

    const handleOnClickDataGrid = (e: any) => {
        const isNarrow = window.matchMedia('(max-width: 768px)').matches;

        const commonResponsive = {
            locateInMenu: 'auto' as const,
            showText: isNarrow ? 'inMenu' : 'always' as const, 
        };
        
        e.toolbarOptions.items.unshift(
            {
                location: "after",
                widget: "dxButton",
                ...commonResponsive,
                options: {
                    icon: "add",
                    text: "Create Employee",
                    onClick: () => {
                        console.log(selectedEmployee);
                        setDrawerCreateVisible(true);
                    },
                },
            },
            {
                location: "after",
                widget: "dxButton",
                ...commonResponsive,
                options: {
                    icon: "edit",
                    text: "Update Employee",
                    onClick: () => {
                        if(selectedEmployee.length === 1) {
                            setDataEmployee(selectedEmployee[0]);
                            setDrawerUpdateVisible(true);
                        }else if(selectedEmployee.length > 1) {
                            swal({
                                title: 'Information',
                                text: 'Select Employee must be one..',
                                icon: 'warning',
                            });
                        }else {
                            swal({
                                title: 'Information',
                                text: 'Please select one employee to update..',
                                icon: 'warning',
                            });
                        }
                    },
                },
            },
            {
                location: "after",
                widget: "dxButton",
                ...commonResponsive,
                options: {
                    icon: "trash",
                    text: "Delete Employee",

                    onClick: () => {
                        if(selectedEmployee.length === 1) {
                            swal({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                buttons: ['Cancel', 'Delete'],
                                dangerMode: true,
                            }).then((willDelete) => {
                                if (willDelete) {
                                    handleRemoveData(selectedEmployee[0]);
                                }
                            })
                        }else {
                            swal({
                                title: 'Information',
                                text: 'Select Employee must be one..',
                                icon: 'warning',
                            });
                        }
                    },
                },
            }
        );
    };
    const handleSelectedEmployee = (e: any) => {
        setSelectedEmployee(e.selectedRowsData);
    };

    useEffect(() => {
        handleCallGetData();
    }, []);

    useEffect(() => {
        if (drawerUpdateVisible && selectedEmployee.length === 1) {
            const selected = selectedEmployee[0];
            setDataEmployee(selected);
            setName(selected.name);
            setEmail(selected.email);
            setPosition(selected.position);
        }
    }, [drawerUpdateVisible]);


    function handleGetData() {
        return new DataSource({
            store: new CustomStore({
                load: async (loadOptions: LoadOptions) => {
                    const {
                    skip,
                    take,
                    requireTotalCount,
                    requireGroupCount,
                    totalSummary,
                    group,
                    groupSummary,
                    filter,
                    } = loadOptions;

                    const params = new URLSearchParams();
                    /**
                     * SET PARAMS DISINI BIAR MANTAP.
                     */
                    if (skip != null) params.set('skip', String(skip));
                    if (take != null) params.set('take', String(take));
                    if (requireTotalCount != null) params.set('requireTotalCount', JSON.stringify(requireTotalCount));
                    if (requireGroupCount != null) params.set('requireGroupCount', JSON.stringify(requireGroupCount));
                    if (totalSummary != null) params.set('totalSummary', JSON.stringify(totalSummary));
                    if (group != null) params.set('group', JSON.stringify(group));
                    if (groupSummary != null) params.set('groupSummary', JSON.stringify(groupSummary));

                    /**
                     * CUSTOM SEARCH UNTUK BISA FILTER SEARCH DI ATAS. SAAT INI MASIH SUPPORT CONTAINS.
                     */
                    const search = Array.isArray(filter)
                    ? ((filter.flat?.(6) ?? filter).includes('contains')
                        ? String((filter.flat?.(6) ?? filter)[(filter.flat?.(6) ?? filter).indexOf('contains') + 1] ?? '').trim()
                        : '')
                    : '';
                    if (search) params.set('search', search);

                    const res = await fetch(`${baseUrl}/employees?${params.toString()}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const json = await res.json();

                    return {
                        data: json?.data ?? [],
                        totalCount: json?.meta?.total ?? 0,
                    };
                },
            }),
        });
    }
    const handleCallGetData = () => {
        setListEmployee(handleGetData());
    }
    const handleCreateData = async() => {
        try {
            const url = `${baseUrl}/employees`;
            let data = {
                name: name,
                email: email,
                position: position
            }
            
            const validates = validationField.current.instance.validate();
            
            if(validates.isValid) {
                setIsLoading(true);
                const postData = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                const resJson = await postData.json();
    
                if(resJson.status === true) {
                    console.log(resJson);
                    setDrawerCreateVisible(false);
                    handleCallGetData();
                }else {
                    swal({
                        title: 'Error!',
                        text: resJson.message,
                        icon: 'error'
                    });
                }
            }
        } catch (err: any) {
            swal({
                title: 'Error!',
                text: err.message,
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }
    const handleUpdateData = async() => {
        try {
            let data = {
                name: name,
                email: email,
                position: position
            }
            const url = `${baseUrl}/employees/${dataEmployee?.id}`;

            const validates = validationField.current.instance.validate();
            
            if(validates.isValid) {
                setIsLoading(true);
                const postData = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                const resJson = await postData.json();
    
                if(resJson.status === true) {
                    console.log(resJson);
                    setDrawerUpdateVisible(false);

                     /**
                     * Clear Data
                     */
                    resetForm();

                    handleCallGetData();
                }else {
                    swal({
                        title: 'Error!',
                        text: resJson.message,
                        icon: 'error'
                    });
                }
            }
        } catch (err: any) {
            swal({
                title: 'Error!',
                text: err.message,
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }
    const handleRemoveData = async(employee: Employee) => {
        try {
            setIsLoading(true);

            const url = `${baseUrl}/employees/${employee?.id}`;
            const removeData = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const resJson = await removeData.json();

            if(resJson.status === true) {
                /**
                 * Clear Data
                 */
                resetForm();

                handleCallGetData();
            }else {
                swal({
                    title: 'Error!',
                    text: resJson.message,
                    icon: 'error'
                });
            }
        } catch (err: any) {
            swal({
                title: 'Error!',
                text: err.message,
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div id='container'>
            <Appbar />
            <Loading visible={isLoading}/>
            
            {/* FORM DRAWER CREATE */}
            <FormDrawer 
                visible={drawerCreateVisible}
                onClose={() => {
                    /**
                     * Pastikan loading sudha selesai sebelum menutup drawer
                     * pastikan drawer create tidak terbuka, jika sedang buka drawer update
                     */
                    if(!isLoading || drawerUpdateVisible === true) {
                        setDrawerCreateVisible(false);
                    }
                }}
                title='Create Employee'
                renderDrawer={
                    <>
                        <ValidationGroup
                            ref={validationField}
                        >
                            <TextInputDefault 
                                Vertical
                                showClearButton
                                title='Name'
                                placeholder='Type Name...'
                                onValueChanged={(e) => setName(e.value)}
                                Validator={
                                    <Validator>
                                        <RequiredRule message='Name is required'/>
                                    </Validator>
                                }
                            />
                            <TextInputDefault 
                                Vertical
                                showClearButton
                                marginTop={10}
                                mode='email'
                                title='Email'
                                placeholder='Type Email...'
                                onValueChanged={(e) => setEmail(e.value)}
                                Validator={
                                    <Validator>
                                        <RequiredRule message='Email is required'/>
                                        <EmailRule message='Email is not valid'/>
                                    </Validator>
                                }
                            />
                            <TextInputDefault 
                                Vertical
                                showClearButton
                                marginTop={10}
                                title='Position'
                                placeholder='Type Position...'
                                onValueChanged={(e) => setPosition(e.value)}
                            />
                        </ValidationGroup>

                        <BasicButton 
                            onClick={handleCreateData}
                            isLoading={isLoading}
                            backgroundColor={Colors.blue}
                            title='Create Employee'
                            letterSpacingTitle={'0.5px'}
                            type='submit'
                        />
                    </>
                }
            />
            
            {/* FORM DRAWER EDIT */}
            <FormDrawer 
                visible={drawerUpdateVisible}
                onClose={() => {
                    /**
                     * Pastikan loading sudha selesai sebelum menutup drawer
                     * dan pastikan drawer update tidak terbuka
                     */
                    if(!isLoading || drawerCreateVisible === true) {
                        setDrawerUpdateVisible(false);

                        /**
                         * Clear Data
                         */
                        resetForm();
                    }
                }}
                title='Update Employee'
                renderDrawer={
                    <>
                        <ValidationGroup
                            ref={validationField}
                        >
                            <TextInputDefault 
                                Vertical
                                showClearButton
                                title='Name'
                                placeholder='Type Name...'
                                value={name}
                                onValueChanged={(e) => setName(e.value)}
                                Validator={
                                    <Validator>
                                        <RequiredRule message='Name is required'/>
                                    </Validator>
                                }
                            />
                            <TextInputDefault 
                                Vertical
                                showClearButton
                                title='Email'
                                placeholder='Type Email...'
                                value={email}
                                onValueChanged={(e) => setEmail(e.value)}
                                Validator={
                                    <Validator>
                                        <RequiredRule message='Email is required'/>
                                        <EmailRule message='Email is not valid'/>
                                    </Validator>
                                }
                            />
                            <TextInputDefault 
                                Vertical
                                showClearButton
                                title='Position'
                                placeholder='Type Position...'
                                value={position}
                                onValueChanged={(e) => setPosition(e.value)}
                            />
                        </ValidationGroup>

                        <BasicButton 
                            onClick={handleUpdateData}
                            isLoading={isLoading}
                            backgroundColor={Colors.blue}
                            title='Update Employee'
                            letterSpacingTitle={'0.5px'}
                            type='submit'
                        />
                    </>
                }
            />

            <div className="content__">
                <Card  
                    title='List Employees'
                    textCenter
                    renderCard={
                        <>
                            <div className="main-datagrid">
                                <DataGrid
                                    dataSource={listEmployee}
                                    showRowLines={true}
                                    showBorders={false}
                                    showColumnLines={true}
                                    rowAlternationEnabled={true}
                                    repaintChangesOnly={true}
                                    allowColumnResizing
                                    onToolbarPreparing={handleOnClickDataGrid}
                                    remoteOperations
                                    
                                    onSelectionChanged={handleSelectedEmployee}
                                    selectedRowKeys={selectedEmployee}
                                >
                                    <Selection mode="multiple" showCheckBoxesMode={'always'} />
                                    <SearchPanel width={250} visible={true} highlightCaseSensitive={true} />
                                    <FilterRow visible/>
                                    <Paging defaultPageSize={10}/>
                                    <Pager allowedPageSizes={[ 5, 10 ]} showInfo showPageSizeSelector showNavigationButtons infoText='Page {0}, Total: {1} ({2} items)' />
                                    <Column 
                                        dataField='name'
                                        caption='Name'
                                        dataType='string'
                                    />
                                    <Column 
                                        dataField='email'
                                        caption='Email'
                                        dataType='string'
                                    />
                                    <Column 
                                        dataField='position'
                                        caption='Position'
                                        dataType='string'
                                    />
                                    <Column 
                                        dataField='created_at'
                                        caption='Create Date'
                                        dataType='date'
                                        format={'dd/MM/yyyy'}
                                    />
                                </DataGrid>
                            </div>
                        </>
                    }
                />
            </div>
        </div>
    )
}

export default Employees;