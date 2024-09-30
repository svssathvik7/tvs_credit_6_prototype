import React, { useEffect, useState } from 'react'
import interestRateData from "../constants/LoanTypeConstants.js";
import EMICalculator from '../utilities/EMICalculator.js';

const EmiInterface = () => {

    const [emiInterface, setEmiInterface] = useState([{
        monthly_emi: '',
        principal: '',
        total_interest: '',
        total_amount: '',
        rate: '',
        tenure: '',
        loan_details: null
    }]);
    const [currCard, setCurrCard] = useState(0);

    const changeInput = (e) => {
        const { name, value } = e.target;
        setEmiInterface((prevValue) => {
            const updatedEmiInterface = [...prevValue];
            updatedEmiInterface[currCard] = { ...updatedEmiInterface[currCard], [name]: value };
            return updatedEmiInterface;
        });
    }

    const chooseLoanType = (e) => {
        const { value } = e.target;

        setEmiInterface((prevValue) => {
            const updatedEmiInterface = [...prevValue];
            updatedEmiInterface[currCard] = { ...updatedEmiInterface[currCard], loan_details: interestRateData[value] };
            return updatedEmiInterface;
        });
    }

    const setRateUtility = () => {
        let roi;
        const currentCard = emiInterface[currCard];
        if (currentCard.tenure < 6) {
            roi = currentCard.loan_details[1];
        } else if (currentCard.tenure >= 6 && currentCard.tenure <= 12) {
            roi = currentCard.loan_details[2];
        } else {
            roi = currentCard.loan_details[3];
        }

        setEmiInterface((prevValue) => {
            const updatedEmiInterface = [...prevValue];
            updatedEmiInterface[currCard] = { ...updatedEmiInterface[currCard], rate: roi };
            return updatedEmiInterface;
        });
    }

    useEffect(() => {
        const { principal, rate, tenure } = emiInterface[currCard];
        if (principal && rate && tenure) {
            const { monthly_emi, total_interest, total_amount } = EMICalculator(
                Number.parseInt(principal),
                Number.parseFloat(rate),
                Number.parseInt(tenure)
            );
            setEmiInterface((prevData) => {
                const updatedEmiInterface = [...prevData];
                updatedEmiInterface[currCard] = {
                    ...updatedEmiInterface[currCard],
                    monthly_emi: monthly_emi,
                    total_interest: total_interest,
                    total_amount: total_amount
                };
                return updatedEmiInterface;
            });
        }
    }, [emiInterface[currCard].principal, emiInterface[currCard].rate, emiInterface[currCard].tenure]);

    useEffect(() => {
        if (emiInterface[currCard].tenure && emiInterface[currCard].loan_details) {
            setRateUtility();
        }
    }, [emiInterface[currCard].tenure, emiInterface[currCard].loan_details]);

    return (
        <div className='w-screen h-1/2 flex justify-center items-center'>
            <div className=' w-2/3 h-full bg-[#EAF4F0] flex justify-between gap-2 rounded-2xl'>
                <div className=' ml-6 w-1/4 h-full flex justify-center items-center rounded-tl-2xl rounded-bl-2xl'>
                    <form className='flex flex-col gap-12' action="" onSubmit={null}>
                        <input min={0} name='principal' className='custom-input p-2' type="number" onChange={changeInput} placeholder='Loan Amount (in rupees)' value={emiInterface[currCard].principal} />
                        <input min={0} name='rate' className='custom-input p-2' type="number" onChange={changeInput} placeholder='Rate of Interest (%)' value={emiInterface[currCard].rate} />
                        <input min={0} name='tenure' className='custom-input p-2' type="number" onChange={changeInput} placeholder='Tenure (Months)' value={emiInterface[currCard].tenure} />
                    </form>
                </div>
                <div className='flex flex-col justify-center gap-4 w-3/4 p-6 h-full items-center rounded-tr-2xl rounded-br-2xl'>
                    <select className='w-fit text-[0.785em] h-8 translate-x-165 self-end rounded-md bg-transparent outline-none' name="Loan Type" id="Loan Type" onChange={chooseLoanType}>
                        {interestRateData.map((type, index) => (
                            <option key={index} value={index}>
                                {type[0]}
                            </option>
                        ))}
                    </select>
                    <div className='bg-[#1BA024] w-full h-60 flex flex-wrap justify-center rounded-2xl p-6'>
                        <div className='w-1/2 flex justify-center items-center'>
                            <div className=' w-fit h-14 flex justify-center items-center px-4 bg-[#167E1B] min-w-[12em] text-white flex-col rounded-md'>
                                <p className={`${emiInterface[currCard].monthly_emi ? " text-xs " : " text-md "}`}>Monthly Emi</p>
                                {emiInterface[currCard].monthly_emi && <p className=' font-bold text-lg'>₹ {emiInterface[currCard].monthly_emi}</p>}
                            </div>
                        </div>
                        <div className='w-1/2 flex justify-center items-center'>
                            <div className=' w-fit h-14 flex justify-center items-center px-4 bg-[#167E1B] min-w-[12em] text-white flex-col rounded-md'>
                                <p className={`${emiInterface[currCard].principal ? " text-xs " : " text-md "}`}>Principal Amount</p>
                                {emiInterface[currCard].principal && <p className=' font-bold text-lg'>₹ {emiInterface[currCard].principal}</p>}
                            </div>
                        </div>
                        <div className='w-1/2 flex justify-center items-center'>
                            <div className=' w-fit h-14 flex justify-center items-center px-4 bg-[#167E1B] min-w-[12em] text-white flex-col rounded-md'>
                                <p className={`${emiInterface[currCard].total_interest ? " text-xs " : " text-md "}`}>Total Interest Payable</p>
                                {emiInterface[currCard].total_interest && <p className=' font-bold text-lg'>₹ {emiInterface[currCard].total_interest}</p>}
                            </div>
                        </div>
                        <div className='w-1/2 flex justify-center items-center'>
                            <div className=' w-fit h-14 flex justify-center items-center px-4 bg-[#167E1B] min-w-[12em] text-white flex-col rounded-md'>
                                <p className={`${emiInterface[currCard].total_amount ? " text-xs " : " text-md "}`}>Total Amount Payable</p>
                                {emiInterface[currCard].total_amount && <p className=' font-bold text-lg'>₹ {emiInterface[currCard].total_amount}</p>}
                            </div>
                        </div>
                    </div>
                    <button disabled={!emiInterface[currCard].monthly_emi} className={`${emiInterface[currCard].monthly_emi ? " opacity-100 " : " opacity-50 "} p-2 text-center text-xs bg-black text-white rounded-md`}>Compare To</button>
                </div>
            </div>
        </div>
    )
}

export default EmiInterface;