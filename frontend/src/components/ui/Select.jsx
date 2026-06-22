import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

export default function Select({ value, onChange, options, className = '' }) {
  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative w-full ${className}`}>
        <ListboxButton className="flex items-center justify-between w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70]/50 transition-all text-left cursor-pointer">
          <span className="truncate">{selectedOption?.label || value}</span>
          <svg
            className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </ListboxButton>

        <ListboxOptions className="absolute z-50 w-full mt-1.5 p-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0">
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="w-full text-left px-3 h-8 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 data-[focus]:bg-[#2E5B70]/10 dark:data-[focus]:bg-slate-800 data-[focus]:text-[#2E5B70] dark:data-[focus]:text-sky-400 transition-colors cursor-pointer flex items-center select-none"
            >
              <span className="truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
