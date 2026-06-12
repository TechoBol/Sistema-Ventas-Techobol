import { useState } from "react";
import { Info } from "lucide-react";
import Popover from "@mui/material/Popover";

import {
  DetailPopoverCard,
  DetailPopoverTitle,
  DetailPopoverTable,
  PricePopoverHead,
  PricePopoverRow,
} from "../ui/Kardex";

export const MarginPriceCell = ({
  type,
  price,
  units = [],
  quantityDiscount = 0,
  bossDiscount = 0,
}) => {
      console.log("UNITS", units);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUnitPrice = (unit) => {
    const salePrice = Number(unit.salePrice || 0);

    switch (type) {
      case "quantity":
        return salePrice - Number(quantityDiscount || 0);

      case "boss":
        return salePrice - Number(bossDiscount || 0);

      default:
        return salePrice;
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span>
          {Number(price || 0).toFixed(2)}
        </span>

        {units?.length > 1 && (
          <Info
            size={16}
            onClick={handleOpen}
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              color: "#64748b",
            }}
          />
        )}
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: "20px",
              boxShadow: "none",
              background: "transparent",
            },
          },
        }}
      >
        <DetailPopoverCard
          style={{
            width: 280,
            minWidth: 280,
          }}
        >
          <DetailPopoverTitle>
            Presentaciones
          </DetailPopoverTitle>

          <DetailPopoverTable>
            <PricePopoverHead>
              <span>UNIDAD</span>
              <span>PRECIO</span>
            </PricePopoverHead>

            {units.map((unit) => (
              <PricePopoverRow key={unit.id}>
                <span>{unit.unit?.name}</span>

                <span>
                  {getUnitPrice(unit).toFixed(2)} Bs.
                </span>
              </PricePopoverRow>
            ))}
          </DetailPopoverTable>
        </DetailPopoverCard>
      </Popover>
    </>
  );
};