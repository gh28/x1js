<?
  $rowItem = $data;
?>
<div class="rowItem">
  <div class="data"
    data-row-item-id="<?=$rowItem["rowItemId"]?>"
    data-item-id="<?=$rowItem["itemId"]?>"
    data-item-image-uri="<?=$rowItem["itemImageUri"]?>"
    data-item-title="<?=$rowItem["itemTitle"]?>"
    data-item-summary="<?=$rowItem["itemSummary"]?>"
    data-item-count="<?=$rowItem["itemCount"]?>"
    data-item-price="<?=$rowItem["itemPrice"]?>"></div>
  <div class="image">
    <img src="" />
  </div>
  <div class="description">
    <div class="title data-itemTitle"></div>
    <div class="data-itemSummary"></div>
<?
  if (isset($rowItem["hasTicket"]) {
?>
    <div class="ticket">
      <img src="/asset/image/ticket.png" />
    </div>
<?
  }
?>
  </div>
  <div class="priceColumn">
    <div class="price">￥<span class="data-itemPrice"></span></div>
    <div class="count">x <span class="data-itemCount"></span></div>
<?
  if (isset($rowItem["hasAction"])) {
?>
    <div class="actionContainer">
      <div class="action-modify">修改</div>
      <div class="action-remove">删除</div>
    </div>
<?
  }
?>
  </div>
</div>
