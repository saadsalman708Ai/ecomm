import React from 'react';
import { NameInput } from './NameInput';
import { PhoneInput } from './PhoneInput';
import { CityDropdown } from './CityDropdown';
import { AreaDropdown } from './AreaDropdown';
import { AddressInput } from './AddressInput';
import { FamousPlaceInput } from './FamousPlaceInput';
import type { OrderUserInfo } from '../../types/order';

interface Props {
  info: OrderUserInfo;
  onChange: (info: OrderUserInfo) => void;
}

export const ProceedForm = ({ info, onChange }: Props) => {
  const update = (key: keyof OrderUserInfo, value: string) => {
    onChange({ ...info, [key]: value, ...(key === 'city' && value !== info.city ? { area: '' } : {}) });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-border">
      <div>
         <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Delivery Information</h2>
      </div>
      <NameInput value={info.fullName} onChange={v => update('fullName', v)} />
      <PhoneInput label="Phone Number" required value={info.phone} onChange={v => update('phone', v)} />
      <PhoneInput label="Second Phone Number" value={info.altPhone || ''} onChange={v => update('altPhone', v)} />
      <div className="flex flex-col gap-4 md:gap-6">
        <CityDropdown value={info.city} onChange={v => update('city', v)} />
        <AreaDropdown cityValue={info.city} value={info.area} onChange={v => update('area', v)} />
      </div>
      <AddressInput value={info.address} onChange={v => update('address', v)} />
      <FamousPlaceInput value={info.famousPlace || ''} onChange={v => update('famousPlace', v)} />
    </div>
  );
};
