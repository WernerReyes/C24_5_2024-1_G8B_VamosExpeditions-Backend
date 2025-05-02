SELECT
  r.created_at AS reservation_date,
  v.final_price,
  v.profit_margin,
  q.id_quotation AS quotation_id,
  v.version_number,
  r.status AS reservation_status,
  r.id
FROM
  (
    (
      reservation r
      JOIN quotation q ON ((r.quotation_id = q.id_quotation))
    )
    JOIN version_quotation v ON ((q.id_quotation = v.quotation_id))
  )
WHERE
  (
    (v.status = 'APPROVED' :: version_quotation_status)
    AND (v.official = TRUE)
    AND (r.is_deleted = false)
  );