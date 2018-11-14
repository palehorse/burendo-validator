## burendo-validator
在表單(form)送出時，檢查表單上的欄位是否符合開發者訂定的規則
## 前置安裝
    jQuery
## 安裝
    npm install burendo-validator
    or
    <script src="burendo-validator/burendo-validator.jquery.js"></script>
### Vue
    require('burendo-validator/burendo-validator.jquery.js');
### 支援的檢查規則
* 必填欄位檢查
* 電子郵件地址格式檢查
* 手機號碼格式檢查(僅適用台灣手機門號)
* 市內電話號碼格式檢查(僅適用台灣市話門號)
* 基本密碼規則檢查(6~12位英文數字組合)
* 僅限數字
* 僅限英文字母
* 僅限英數文字組合
## 欄位格式
### 必填欄位
	<input type="text" name="name" required />
### Email
	<input type="email" name="email" />
### 手機號碼
    <input type="phone" name="phone" />
### 市內電話
    <input type="tel" name="tel" />
### 密碼規則
    <input type="password" name="password" /> <!-- 預設為6~12位英文數字組合 -->
### 僅限數字
    <input type="number" name="stock" />
### 僅限英文字母
    <input type="text" name="last_name" validate-type="alphabet" />
### 僅限英數文字組合
    <input type="text" name="username" validate-type="mix" />
## 使用方法
### 基本用法
	$('.data-form').validate();
### 自訂格式
	$('.data-form').validate({
		format: {
			password: /^[a-zA-Z0-9&\$\.]{8,16}$/,  //8~16位英數組合及限定符號
			date: /^20\d{2}\-\d{1,2}\-\d{1,2}$/    //限制日期格式
		}
	});
### 自訂訊息
	$('.data-form').validate({
		message: {
			required: "必填欄位不可空白",
			format: {
				password: "須為8~16位英數組合及&、$、.",
				date: "請輸入西元年月日，例如2018-9-20"
			}
		}
	});
### 驗證成功與失敗
	$('.data-form').validate({
		success: function() {
		    //Do something when validating successfully
		},
		fail: function() {
			//Handle the failure
		}
	});
