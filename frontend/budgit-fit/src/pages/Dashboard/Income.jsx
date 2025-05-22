

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import {useUserAuth} from '../../hooks/useUserAuth';

// import Modal from "../../components/Modals"; // spelling corrected from 'componenets'
// import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast"; 
// import IncomeList from "../../components/Income/Incomelist";
// import DeleteAlert from "../../components/DeleteAlert";

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const handleAddIncome = async (income) =>{
    const {source, amount , date , icon} = income;
    //Validation Checks
    if(!source.trim()){
      toast.error("Source is required");
    }
    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if(!date){
      toast.error("Date is required");
      return;
    }
    try{
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModal(false);
      toast.success("Income Added");
      fetchIncomeDetails();
    }catch(error){
      console.log("Error adding income:",error.response?.data?.message || error.message);
    }
  };
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false); // 'open' should be lowercase

  // Get All Income Details
   const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME); // corrected quotes
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
   };
   



 
  



  // // Delete Income
  const deleteIncome = async(id) => {
    try {
          await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
          setOpenDeleteAlert({ show: false, data: null });
          toast.success("Income details deleted successfully");
          fetchIncomeDetails();
        } catch (error) {
          console.error(
            "Error deleting income:",
            error.response?.data?.message || error.message
          );
        }
    
  };
 
 
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
 };


  useEffect(() => {
    fetchIncomeDetails(); // parentheses lagana bhool gaye the
    
    return () =>{};
  }, []);
  console.log("💡 Transaction data for IncomeOverview:", incomeData);

  return (
    <DashboardLayout activeMenu="income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          
        <IncomeOverview
  transactions={incomeData}  // ✅ correct prop name
  onAddIncome={() => setOpenAddIncomeModal(true)}
/>

          

           <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

         <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
         <AddIncomeForm onAddIncome={handleAddIncome}  onClose={() => setOpenAddIncomeModal(false)}/>
        </Modal> 

        <Modal 
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income detail?" // spelling fixed
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal> 

      </div>
    </DashboardLayout>
  );
};

export default Income;
