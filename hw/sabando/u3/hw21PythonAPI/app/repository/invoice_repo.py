from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate

async def find_all(db=None) -> list[Invoice]:
    return await Invoice.find_all().to_list()

async def find_one(db, invoice_id: str) -> Invoice | None:
    return await Invoice.get(invoice_id)

async def create(db, data: InvoiceCreate) -> Invoice:
    invoice_dict = data.model_dump(exclude_unset=True)
    if "id" in invoice_dict and invoice_dict["id"]:
        invoice_dict["_id"] = invoice_dict.pop("id")
    else:
        invoice_dict.pop("id", None)
    invoice = Invoice(**invoice_dict)
    await invoice.insert()
    return invoice

async def update(db, invoice_id: str, data: InvoiceUpdate) -> Invoice | None:
    invoice = await Invoice.get(invoice_id)
    if invoice is None:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(invoice, key, value)
    await invoice.save()
    return invoice

async def remove(db, invoice_id: str) -> bool:
    invoice = await Invoice.get(invoice_id)
    if invoice is None:
        return False
    await invoice.delete()
    return True
