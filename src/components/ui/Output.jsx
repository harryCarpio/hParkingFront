import React from 'react'

export const Output = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
                {label}
            </label>

            <div
                className="w-full px-4 py-2  rounded-lg 
                           text-gray-700 bg-gray-100 min-h-[42px]
                           flex items-center"
            >
                {value ?? "-"}
            </div>
        </div>
    )
}
