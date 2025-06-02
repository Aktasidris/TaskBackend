# Task Management API Tests

Bu koleksiyon, Task Management API'sini test etmek için gerekli tüm endpoint'leri ve test senaryolarını içerir.

## Kurulum

1. Postman'i açın
2. Collections > Import düğmesine tıklayın
3. `Task_Management_API.postman_collection.json` dosyasını import edin
4. Environments > Import düğmesine tıklayın
5. `Task_Management_API.postman_environment.json` dosyasını import edin
6. Environment'ı aktif edin

## Test Senaryoları

### 1. Auth Tests

- Login başarılı olmalı ve token dönmeli
- Geçersiz kimlik bilgileriyle login başarısız olmalı
- Token ile /me endpoint'i kullanıcı bilgilerini dönmeli

### 2. Roles Tests

- Yeni rol oluşturulabilmeli (super_admin)
- Rol ID'si environment'a kaydedilmeli
- Aynı isimle rol oluşturulamamalı
- Rol listesi alınabilmeli

### 3. Users Tests

- Yeni kullanıcı oluşturulabilmeli
- Kullanıcı ID'si environment'a kaydedilmeli
- Kullanıcı listesi alınabilmeli
- Kullanıcı güncellenebilmeli
- Kullanıcı silinebilmeli

### 4. Projects Tests

- Yeni proje oluşturulabilmeli
- Proje ID'si environment'a kaydedilmeli
- Proje listesi alınabilmeli
- Proje detayı görüntülenebilmeli
- Proje güncellenebilmeli
- Proje silinebilmeli

### 5. Tasks Tests

- Yeni task oluşturulabilmeli
- Task ID'si environment'a kaydedilmeli
- Task listesi alınabilmeli
- Task güncellenebilmeli
- Task taşınabilmeli (move)
- Task silinebilmeli

### 6. Remarks Tests

- Yeni remark oluşturulabilmeli
- Remark ID'si environment'a kaydedilmeli
- Remark listesi alınabilmeli
- Remark detayı görüntülenebilmeli
- Tüm proje verilerini alabilmeli (allprojectdata)
- İstatistikleri alabilmeli (statistics)
- Remark silinebilmeli

### 7. Types Tests

- Yeni type oluşturulabilmeli
- Type ID'si environment'a kaydedilmeli
- Type listesi alınabilmeli
- Type detayı görüntülenebilmeli
- Type güncellenebilmeli
- Type silinebilmeli

### 8. Status Tests

- Yeni status oluşturulabilmeli
- Status ID'si environment'a kaydedilmeli
- Status listesi alınabilmeli
- Status detayı görüntülenebilmeli
- Status güncellenebilmeli
- Status silinebilmeli

### 9. Column Tests

- Kolonlar ve tasklar listelenebilmeli (withtask)
- Yeni kolon oluşturulabilmeli
- Kolon güncellenebilmeli
- Kolon sırası değiştirilebilmeli (move)
- Kolon içeriği temizlenebilmeli (clear)
- Kolon silinebilmeli

### 10. Comments Tests

- Yeni yorum eklenebilmeli
- Dosyalı yorum eklenebilmeli
- Remark'a ait yorumlar listelenebilmeli
- Remark'a ait yorumlar ve dosyaları listelenebilmeli

### 11. Board Tests

- Board verisi (kolonlar, tasklar ve sıralama) alınabilmeli

## Test Sırası

Testleri aşağıdaki sırayla çalıştırın:

1. Auth > Login
2. Auth > Get Me
3. Roles > Create Role
4. Users > Create User
5. Users > Get Users
6. Projects > Create Project
7. Projects > Get Projects
8. Types > Create Type
9. Status > Create Status
10. Column > Create Column
11. Tasks > Create Task
12. Tasks > Get Tasks
13. Tasks > Move Task
14. Remarks > Create Remark
15. Remarks > Get Remarks
16. Comments > Add Comment
17. Comments > Get Comments
18. Board > Get Board Data

## Environment Variables

- `baseUrl`: API'nin base URL'i
- `test_user_email`: Test kullanıcısının email'i
- `test_user_password`: Test kullanıcısının şifresi
- `token`: Login sonrası otomatik set edilir
- `role_id`: Rol oluşturma sonrası otomatik set edilir
- `user_id`: Kullanıcı oluşturma sonrası otomatik set edilir
- `project_id`: Proje oluşturma sonrası otomatik set edilir
- `task_id`: Task oluşturma sonrası otomatik set edilir
- `remark_id`: Remark oluşturma sonrası otomatik set edilir
- `status_id`: Status oluşturma sonrası otomatik set edilir
- `type_id`: Type oluşturma sonrası otomatik set edilir
- `source_column_id`: Task taşıma işlemi için kaynak kolon ID'si
- `destination_column_id`: Task taşıma işlemi için hedef kolon ID'si
- `column_id`: Kolon işlemleri için kolon ID'si
- `column_id_1`: Kolon sıralama için birinci kolon ID'si
- `column_id_2`: Kolon sıralama için ikinci kolon ID'si
- `column_id_3`: Kolon sıralama için üçüncü kolon ID'si
- `file_id`: Dosya işlemleri için dosya ID'si

## Test Assertions

Her request için aşağıdaki kontroller yapılır:

1. Status code kontrolü

   - 200: Başarılı GET istekleri
   - 201: Başarılı POST istekleri (create)
   - 204: Başarılı DELETE istekleri
   - 400: Validation hataları
   - 401: Authentication hataları
   - 403: Authorization hataları
   - 404: Resource bulunamadı
   - 500: Sunucu hataları

2. Response format kontrolü

   - Success response format:
     ```json
     {
       "data": {...},
       "success": true
     }
     ```
   - Error response format:
     ```json
     {
       "error": {
         "message": "Error message",
         "description": "Detailed error description"
       },
       "code": 400
     }
     ```

3. Gerekli alanların varlığı kontrolü

   - ID kontrolü
   - Required field'ların kontrolü
   - Data type kontrolü

4. Environment variable'ların set edilmesi
   - Her create işleminden sonra ilgili ID'nin kaydedilmesi
   - Token'ın login sonrası kaydedilmesi

## Hata Durumları

Aşağıdaki hata durumları test edilir:

- 400: Bad Request
  - Eksik required field
  - Geçersiz data type
  - Validation hatası
- 401: Unauthorized
  - Token eksik
  - Token geçersiz
  - Token süresi dolmuş
- 403: Forbidden
  - Yetkisiz erişim
  - Role-based access control hatası
- 404: Not Found
  - Resource bulunamadı
  - Endpoint bulunamadı
- 500: Internal Server Error
  - Sunucu hatası
  - Database hatası

## Önemli Notlar

1. Backend sunucusunun çalışır durumda olduğundan emin olun
2. MongoDB'nin çalışır durumda olduğundan emin olun
3. İlk kullanıcı ve rol oluşturma işlemleri için authentication gerekmez
4. Diğer tüm işlemler için valid bir JWT token gerekir
5. Test sırasını takip edin, çünkü bazı testler önceki testlerin sonuçlarına bağlıdır
6. Her testten sonra response'u kontrol edin
7. Hata durumlarını da test etmeyi unutmayın
8. Task taşıma işlemi için source_column_id ve destination_column_id değerlerinin doğru olduğundan emin olun
9. İstatistik endpointlerinde timerange parametresinin (days, weeks, month, year, years) doğru olduğundan emin olun
10. Kolon sıralama işlemi için column_id_1, column_id_2 ve column_id_3 değerlerinin doğru olduğundan emin olun
11. Dosya işlemleri için file_id değerinin doğru olduğundan emin olun
